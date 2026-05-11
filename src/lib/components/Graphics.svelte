<script>
	import { onMount } from 'svelte';
	import { reveal } from '$lib/utils/reveal.js';
	import { COLORS, COLOR_ORDER, COLOR_NAMES, getFlowerFileNames, BLOB_SHAPES } from '$lib/constants.js';
	import { loadSvgForEditing, downloadSvgAsPng, downloadFile } from '$lib/utils/svgUtils.js';
	import { downloadStaticZip } from '$lib/utils/zipUtils.js';

	let activeBlobTab = 'solid';
	let selectedBlob = null;
	let blobEditor = null;
	let blobColorMap = {};
	let blobPreviewUrl = '';
	let blobPreviewBg = '#fafafa';
	let isLoadingBlob = false;
	let solidBlobColor = 'carrot';
	$: solidBlobThumbBg = solidBlobColor === 'true_white' ? '#222222' : '#fafafa';
	$: solidBlobLabelColor = solidBlobColor === 'true_white' ? '#FFFFFF' : 'rgba(0,0,0,0.4)';

	// Flower interactive state
	let selectedFlower = null;
	let flowerEditor = null;
	let flowerColorMap = {};
	let flowerPreviewUrl = '';
	let flowerPreviewBg = '#fafafa';
	let flowerVariant = 'filled';
	let isLoadingFlower = false;

	const flowerNames = getFlowerFileNames();
	const DEFAULT_FLOWER = 'flower-carrot-filled';

	function getAdaptiveBg(originalColors) {
		if (!originalColors || originalColors.length === 0) return '#fafafa';
		const hasWhite = originalColors.some(c => c?.toUpperCase() === '#FFFFFF');
		const hasBlack = originalColors.some(c => c?.toUpperCase() === '#000000');
		if (hasWhite && hasBlack) return '#FE6705';
		if (hasWhite) return '#000000';
		return '#fafafa';
	}

	function getPreviewBg(editor, colorMap) {
		if (!editor || !colorMap) return '#fafafa';
		const currentColors = editor.originalColors.map((c, i) => colorMap[i] || c);
		return getAdaptiveBg(currentColors);
	}

	function parseFlowerName(name) {
		const s = name.replace('flower-', '');
		const parts = s.split('-');
		if (parts.length === 2) {
			const [a, b] = parts;
			if (b === 'filled' || b === 'open') {
				return { base: a, variant: b, isDual: false };
			}
			return { base: a, variant: 'dual', inner: b, isDual: true };
		}
		return null;
	}

	function getVariantUrl(base, variant, inner) {
		if (variant === 'filled') return `/assets/flowers/svg/flower-${base}-filled.svg`;
		if (variant === 'open') return `/assets/flowers/svg/flower-${base}-open.svg`;
		return `/assets/flowers/svg/flower-${base}-${inner}.svg`;
	}

	const DUAL_FALLBACK = 'flower-carrot-kiwi';

	const solidShapes = BLOB_SHAPES.map(n => ({
		shape: n,
		thumb: (color) => `/assets/blobs/solid/svg/blob-${n}-${color || solidBlobColor}.svg`,
		src: (color) => `/assets/blobs/solid/svg/blob-${n}-${color}.svg`,
		type: 'solid'
	}));

	const multicolorShapes = [
		{ shape: '01', perm: 'carrot-kiwi', thumb: `/assets/blobs/multicolor/svg/blob-01-carrot-kiwi.svg` },
		{ shape: '02', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-02-carrot-kiwi-lychee.svg` },
		{ shape: '03', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-03-carrot-kiwi-lychee.svg` },
		{ shape: '04', perm: 'carrot-kiwi', thumb: `/assets/blobs/multicolor/svg/blob-04-carrot-kiwi.svg` },
		{ shape: '05', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-05-carrot-kiwi-lychee.svg` },
		{ shape: '06', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-06-carrot-kiwi-lychee.svg` },
		{ shape: '07', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-07-carrot-kiwi-lychee.svg` },
		{ shape: '08', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-08-carrot-kiwi-lychee.svg` },
		{ shape: '09', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-09-carrot-kiwi-lychee.svg` },
		{ shape: '10', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-10-carrot-kiwi-lychee.svg` },
		{ shape: '11', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-11-carrot-kiwi-lychee.svg` },
		{ shape: '12', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-12-carrot-kiwi-lychee.svg` },
		{ shape: '13', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-13-carrot-kiwi-lychee.svg` },
		{ shape: '14', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-14-carrot-kiwi-lychee.svg` },
		{ shape: '15', perm: 'carrot-kiwi-lychee', thumb: `/assets/blobs/multicolor/svg/blob-15-carrot-kiwi-lychee.svg` }
	];

	const sideShapes = [
		'side-left-carrot-kiwi-lychee', 'side-left-carrot-lychee-kiwi',
		'side-left-kiwi-carrot-lychee', 'side-left-kiwi-lychee-carrot',
		'side-left-lychee-carrot-kiwi', 'side-left-lychee-kiwi-carrot',
		'side-right-carrot-kiwi-lychee', 'side-right-carrot-lychee-kiwi',
		'side-right-kiwi-carrot-lychee', 'side-right-kiwi-lychee-carrot',
		'side-right-lychee-carrot-kiwi', 'side-right-lychee-kiwi-carrot'
	].map(name => ({
		shape: name,
		thumb: `/assets/blobs/sides/svg/${name}.svg`,
		type: 'sides'
	}));

	onMount(() => {
		selectFlower(DEFAULT_FLOWER);
	});

	$: blobPreviewBg = getPreviewBg(blobEditor, blobColorMap);

	async function selectBlob(shape, type) {
		isLoadingBlob = true;
		selectedBlob = { shape, type };
		blobColorMap = {};
		blobPreviewUrl = '';
		blobEditor = null;

		let url;
		if (type === 'solid') {
			url = `/assets/blobs/solid/svg/blob-${shape}-${solidBlobColor}.svg`;
		} else if (type === 'multicolor') {
			const perm = (shape === '01' || shape === '04') ? 'carrot-kiwi' : 'carrot-kiwi-lychee';
			url = `/assets/blobs/multicolor/svg/blob-${shape}-${perm}.svg`;
		} else {
			url = `/assets/blobs/sides/svg/${shape}.svg`;
		}

		const editor = await loadSvgForEditing(url);
		blobEditor = editor;
		if (editor) {
			editor.originalColors.forEach((c, i) => {
				blobColorMap[i] = c;
			});
			updateBlobPreview();
		}
		isLoadingBlob = false;
	}

	function updateBlobPreview() {
		if (!blobEditor) return;
		const map = {};
		blobEditor.originalColors.forEach((orig, i) => {
			map[orig] = blobColorMap[i] || orig;
		});
		const svg = blobEditor.getModifiedSvg(map);
		const blob = new Blob([svg], { type: 'image/svg+xml' });
		if (blobPreviewUrl) URL.revokeObjectURL(blobPreviewUrl);
		blobPreviewUrl = URL.createObjectURL(blob);
	}

	function setBlobColor(index, colorKey) {
		blobColorMap[index] = COLORS[colorKey];
		updateBlobPreview();
	}

	function downloadBlobSvg() {
		if (!blobEditor) return;
		const map = {};
		blobEditor.originalColors.forEach((orig, i) => {
			map[orig] = blobColorMap[i] || orig;
		});
		const svg = blobEditor.getModifiedSvg(map);
		const blob = new Blob([svg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		downloadFile(url, `blob-custom-${selectedBlob.shape}.svg`);
	}

	async function downloadBlobPng() {
		if (!blobEditor) return;
		const map = {};
		blobEditor.originalColors.forEach((orig, i) => {
			map[orig] = blobColorMap[i] || orig;
		});
		const svg = blobEditor.getModifiedSvg(map);
		await downloadSvgAsPng(svg, `blob-custom-${selectedBlob.shape}.png`, 800, 800);
	}

	async function selectFlower(name) {
		isLoadingFlower = true;
		const parsed = parseFlowerName(name);
		if (!parsed) return;
		selectedFlower = parsed;
		flowerVariant = parsed.variant;
		flowerColorMap = {};
		flowerPreviewUrl = '';
		flowerEditor = null;

		const url = `/assets/flowers/svg/${name}.svg`;
		const editor = await loadSvgForEditing(url);
		flowerEditor = editor;
		if (editor) {
			editor.originalColors.forEach((c, i) => {
				flowerColorMap[i] = c;
			});
			updateFlowerPreview();
		}
		isLoadingFlower = false;
	}

	function updateFlowerPreview() {
		if (!flowerEditor) return;
		const map = {};
		flowerEditor.originalColors.forEach((orig, i) => {
			map[orig] = flowerColorMap[i] || orig;
		});
		const svg = flowerEditor.getModifiedSvg(map);
		const blob = new Blob([svg], { type: 'image/svg+xml' });
		if (flowerPreviewUrl) URL.revokeObjectURL(flowerPreviewUrl);
		flowerPreviewUrl = URL.createObjectURL(blob);
	}

	$: flowerPreviewBg = getPreviewBg(flowerEditor, flowerColorMap);

	function setFlowerColor(index, colorKey) {
		flowerColorMap[index] = COLORS[colorKey];
		updateFlowerPreview();
	}

	async function toggleFlowerVariant(variant) {
		if (!selectedFlower) return;
		const base = selectedFlower.base;
		let inner = selectedFlower.inner;
		const prevColorMap = { ...flowerColorMap };

		if (variant === 'dual') {
			if (!inner) inner = 'kiwi';
		}

		// For dual, always load a known-good dual SVG with 2 distinct fills
		// The color pickers let users set any colors they want
		const url = variant === 'dual'
			? `/assets/flowers/svg/${DUAL_FALLBACK}.svg`
			: getVariantUrl(base, variant, inner);

		isLoadingFlower = true;
		const editor = await loadSvgForEditing(url);
		flowerEditor = editor;
		flowerVariant = variant;
		flowerColorMap = {};
		selectedFlower = { base, variant, inner, isDual: variant === 'dual' };

		if (editor) {
			editor.originalColors.forEach((c, i) => {
				const prevValues = Object.values(prevColorMap);
				const matchIdx = prevValues.findIndex(v => v?.toUpperCase() === c?.toUpperCase());
				flowerColorMap[i] = matchIdx >= 0 ? prevColorMap[Object.keys(prevColorMap)[matchIdx]] : c;
			});
			updateFlowerPreview();
		}
		isLoadingFlower = false;
	}

	function downloadFlowerSvg() {
		if (!flowerEditor) return;
		const map = {};
		flowerEditor.originalColors.forEach((orig, i) => {
			map[orig] = flowerColorMap[i] || orig;
		});
		const svg = flowerEditor.getModifiedSvg(map);
		const blob = new Blob([svg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const base = selectedFlower.base;
		const variant = selectedFlower.variant;
		const inner = selectedFlower.inner || '';
		const suffix = variant === 'dual' ? `${base}-${inner}` : `${base}-${variant}`;
		downloadFile(url, `flower-custom-${suffix}.svg`);
	}

	async function downloadFlowerPng() {
		if (!flowerEditor) return;
		const map = {};
		flowerEditor.originalColors.forEach((orig, i) => {
			map[orig] = flowerColorMap[i] || orig;
		});
		const svg = flowerEditor.getModifiedSvg(map);
		const base = selectedFlower.base;
		const variant = selectedFlower.variant;
		const inner = selectedFlower.inner || '';
		const suffix = variant === 'dual' ? `${base}-${inner}` : `${base}-${variant}`;
		await downloadSvgAsPng(svg, `flower-custom-${suffix}.png`);
	}

	function downloadFlowerSvgStatic(name) {
		downloadFile(`/assets/flowers/svg/${name}.svg`, `${name}.svg`);
	}

	function downloadFlowerPngStatic(name) {
		downloadFile(`/assets/flowers/png/${name}.png`, `${name}.png`);
	}
</script>

<section id="graphics" class="section section-white">
	<div class="container">
		<h2 class="section-heading reveal" use:reveal>THE GRAPHICS</h2>
		<p class="section-sub reveal" use:reveal>Blobs and flowers combine freely to form any layout, pattern, or background.</p>

		<!-- BLOBS -->
		<div class="graphic-block reveal" use:reveal>
			<div class="block-header">
				<h3>BLOBS</h3>
				<div class="blob-tabs">
					<button class="tab-btn" class:active={activeBlobTab === 'solid'} on:click={() => { activeBlobTab = 'solid'; selectedBlob = null; }}>SOLID</button>
					<button class="tab-btn" class:active={activeBlobTab === 'multicolor'} on:click={() => { activeBlobTab = 'multicolor'; selectedBlob = null; }}>MULTICOLOR</button>
					<button class="tab-btn" class:active={activeBlobTab === 'sides'} on:click={() => { activeBlobTab = 'sides'; selectedBlob = null; }}>SIDES</button>
				</div>
			</div>

			{#if selectedBlob}
				<div class="blob-detail">
					<button class="back-btn" on:click={() => selectedBlob = null}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
						Back to shapes
					</button>

					<div class="detail-layout">
						<div class="detail-preview" style="background: {blobPreviewBg}">
							{#if blobPreviewUrl}
								<img src={blobPreviewUrl} alt="Blob preview" class="blob-preview-img">
							{:else if isLoadingBlob}
								<div class="loading">Loading...</div>
							{/if}
						</div>

						<div class="detail-controls">
							{#if blobEditor}
								{#each blobEditor.originalColors as origColor, i}
									<div class="color-picker-group">
										<span class="picker-label">PART {i + 1}</span>
										<div class="picker-dots">
											{#each COLOR_ORDER as ck}
												<button
													class="picker-dot"
													class:active={blobColorMap[i] === COLORS[ck]}
													style="background: {COLORS[ck]}"
													title={COLOR_NAMES[ck]}
													on:click={() => setBlobColor(i, ck)}
												></button>
											{/each}
										</div>
									</div>
								{/each}
							{/if}

							<div class="detail-actions">
								<button class="btn btn-outline-dark" on:click={downloadBlobSvg}>DOWNLOAD SVG</button>
								<button class="btn btn-outline-dark" on:click={downloadBlobPng}>DOWNLOAD PNG</button>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="shape-grid">
					{#if activeBlobTab === 'solid'}
						<div class="shape-grid-top">
							<div class="blob-overview-colorpicker">
								{#each COLOR_ORDER as ck}
									<button
										class="picker-dot"
										class:active={solidBlobColor === ck}
										style="background: {COLORS[ck]}"
										title={COLOR_NAMES[ck]}
										on:click={() => solidBlobColor = ck}
									></button>
								{/each}
							</div>
						</div>
						{#each solidShapes as s}
							<button class="shape-thumb" style="background: {solidBlobThumbBg}" on:click={() => selectBlob(s.shape, 'solid')}>
								<img src={s.thumb(solidBlobColor)} alt="Blob shape {s.shape}" loading="lazy">
								<span class="shape-label" style="color: {solidBlobLabelColor}">{s.shape}</span>
							</button>
						{/each}
					{:else if activeBlobTab === 'multicolor'}
						{#each multicolorShapes as s}
							<button class="shape-thumb" on:click={() => selectBlob(s.shape, 'multicolor')}>
								<img src={s.thumb} alt="Blob shape {s.shape}" loading="lazy">
								<span class="shape-label">{s.shape}</span>
							</button>
						{/each}
					{:else}
						{#each sideShapes as s}
							<button class="shape-thumb shape-thumb-side" on:click={() => selectBlob(s.shape, 'sides')}>
								<img src={s.thumb} alt="{s.shape}" loading="lazy" class="thumb-img-side">
								<span class="shape-label">{s.shape.replace('side-', '').toUpperCase()}</span>
							</button>
						{/each}
					{/if}
				</div>
			{/if}

			<div class="bulk-download">
				<span class="bulk-label">DOWNLOAD ALL</span>
				<div class="bulk-rows">
					<div class="bulk-row">
						<span class="bulk-cat">SOLID</span>
						<button class="btn btn-outline-dark btn-sm" on:click={() => downloadStaticZip('/zips/blobs-solid-svg.zip', 'blobs-solid-svg.zip')}>SVG</button>
						<button class="btn btn-outline-dark btn-sm" on:click={() => downloadStaticZip('/zips/blobs-solid-png.zip', 'blobs-solid-png.zip')}>PNG</button>
					</div>
					<div class="bulk-row">
						<span class="bulk-cat">MULTICOLOR</span>
						<button class="btn btn-outline-dark btn-sm" on:click={() => downloadStaticZip('/zips/blobs-multicolor-svg.zip', 'blobs-multicolor-svg.zip')}>SVG</button>
						<button class="btn btn-outline-dark btn-sm" on:click={() => downloadStaticZip('/zips/blobs-multicolor-png.zip', 'blobs-multicolor-png.zip')}>PNG</button>
					</div>
					<div class="bulk-row">
						<span class="bulk-cat">SIDES</span>
						<button class="btn btn-outline-dark btn-sm" on:click={() => downloadStaticZip('/zips/blobs-sides-svg.zip', 'blobs-sides-svg.zip')}>SVG</button>
						<button class="btn btn-outline-dark btn-sm" on:click={() => downloadStaticZip('/zips/blobs-sides-png.zip', 'blobs-sides-png.zip')}>PNG</button>
					</div>
					<div class="bulk-row">
						<span class="bulk-cat">ALL</span>
						<button class="btn btn-outline-dark btn-sm" on:click={() => downloadStaticZip('/zips/blobs-all-svg.zip', 'blobs-all-svg.zip')}>ALL SVGs</button>
						<button class="btn btn-outline-dark btn-sm" on:click={() => downloadStaticZip('/zips/blobs-all-png.zip', 'blobs-all-png.zip')}>ALL PNGs</button>
					</div>
				</div>
			</div>
		</div>

		<!-- FLOWERS -->
		<div class="graphic-block reveal" use:reveal>
			<div class="block-header">
				<h3>FLOWERS</h3>
				<div class="block-actions">
					<button class="btn btn-outline-dark" on:click={() => downloadStaticZip('/zips/flowers-svg.zip', 'flowers-svg.zip')}>ALL SVGs</button>
					<button class="btn btn-outline-dark" on:click={() => downloadStaticZip('/zips/flowers-png.zip', 'flowers-png.zip')}>ALL PNGs</button>
				</div>
			</div>

			<div class="blob-detail">
				<div class="detail-layout">
					<div class="detail-preview" style="background: {flowerPreviewBg}">
						{#if flowerPreviewUrl}
							<img src={flowerPreviewUrl} alt="Flower preview" class="blob-preview-img">
						{:else if isLoadingFlower}
							<div class="loading">Loading...</div>
						{/if}
					</div>

					<div class="detail-controls">
							<div class="flower-variant-toggle">
								<span class="picker-label">STYLE</span>
								<div class="flower-variant-btns">
									<button
										class="flower-variant-btn"
										class:active={flowerVariant === 'filled'}
										on:click={() => toggleFlowerVariant('filled')}
									>FILLED</button>
									<button
										class="flower-variant-btn"
										class:active={flowerVariant === 'open'}
										on:click={() => toggleFlowerVariant('open')}
									>OPEN</button>
									<button
										class="flower-variant-btn"
										class:active={flowerVariant === 'dual'}
										on:click={() => toggleFlowerVariant('dual')}
									>DUAL</button>
								</div>
							</div>

							{#if flowerEditor}
								{#each flowerEditor.originalColors as origColor, i}
									<div class="color-picker-group">
										<span class="picker-label">
											{flowerVariant === 'dual' && flowerEditor.originalColors.length > 1
												? (i === 0 ? 'CENTER' : 'PETAL')
												: `COLOR ${i + 1}`}
										</span>
										<div class="picker-dots">
											{#each COLOR_ORDER as ck}
												<button
													class="picker-dot"
													class:active={flowerColorMap[i] === COLORS[ck]}
													style="background: {COLORS[ck]}"
													title={COLOR_NAMES[ck]}
													on:click={() => setFlowerColor(i, ck)}
												></button>
											{/each}
										</div>
									</div>
								{/each}
							{/if}

						<div class="detail-actions">
							<button class="btn btn-outline-dark" on:click={downloadFlowerSvg}>DOWNLOAD SVG</button>
							<button class="btn btn-outline-dark" on:click={downloadFlowerPng}>DOWNLOAD PNG</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.graphic-block {
		margin-bottom: 80px;
	}

	.block-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
		flex-wrap: wrap;
		gap: 16px;
	}

	.block-header h3 {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 3px;
	}

	.blob-tabs {
		display: flex;
		gap: 4px;
		background: #f5f5f5;
		padding: 4px;
		border-radius: 8px;
	}

	.tab-btn {
		font-family: var(--font);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 1.5px;
		padding: 8px 16px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		background: transparent;
		color: rgba(0,0,0,0.5);
		transition: all 0.2s;
		text-transform: uppercase;
	}

	.tab-btn.active {
		background: #000000;
		color: #FFFFFF;
	}

	.shape-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 12px;
	}

	.shape-thumb {
		aspect-ratio: 1;
		padding: 12px;
		background: #fafafa;
		border: 2px solid #eee;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-family: var(--font);
	}

	.shape-thumb:hover {
		transform: scale(1.05);
		border-color: #FE6705;
		background: #fff;
	}

	.shape-thumb img {
		width: 100%;
		height: auto;
		max-height: 60px;
		object-fit: contain;
	}

	.shape-thumb-side {
		aspect-ratio: 1;
	}

	.thumb-img-side {
		max-height: 60px;
	}

	.shape-thumb-side .thumb-img-side {
		max-height: 60px;
	}

	.shape-label {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 1.5px;
		color: rgba(0,0,0,0.4);
	}

	.back-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 1.5px;
		background: none;
		border: none;
		cursor: pointer;
		color: rgba(0,0,0,0.5);
		margin-bottom: 24px;
		transition: color 0.2s;
	}

	.back-btn:hover {
		color: #000000;
	}

	.blob-detail {
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.detail-layout {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 32px;
		align-items: start;
	}

	.detail-preview {
		border-radius: 16px;
		border: 2px solid #eee;
		padding: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
	}

	.blob-preview-img {
		max-width: 100%;
		max-height: 360px;
		width: auto;
		height: auto;
	}

	.loading {
		font-size: 14px;
		color: rgba(0,0,0,0.4);
	}

	.detail-controls {
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 32px;
		background: #fafafa;
		border-radius: 16px;
		border: 2px solid #eee;
	}

	.color-picker-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.picker-label {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 2px;
		color: rgba(0,0,0,0.4);
	}

	.picker-dots {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.picker-dot {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid rgba(0,0,0,0.1);
		cursor: pointer;
		transition: all 0.2s;
		padding: 0;
	}

	.picker-dot:hover {
		transform: scale(1.1);
	}

	.picker-dot.active {
		border-color: #000000;
		box-shadow: 0 0 0 2px #fff, 0 0 0 4px #000;
		transform: scale(1.1);
	}

	.detail-actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 8px;
	}

	.bulk-download {
		margin-top: 24px;
	}

	.bulk-label {
		display: block;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 2px;
		color: rgba(0,0,0,0.35);
		margin-bottom: 10px;
	}

	.bulk-rows {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.bulk-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.bulk-cat {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 1.5px;
		color: rgba(0,0,0,0.5);
		min-width: 100px;
	}

	.btn-sm {
		font-size: 10px;
		padding: 6px 12px;
		letter-spacing: 1px;
		font-weight: 600;
	}

	.shape-grid-top {
		grid-column: 1 / -1;
		display: flex;
		justify-content: flex-start;
		margin-bottom: 4px;
	}

	.blob-overview-colorpicker {
		display: flex;
		gap: 8px;
		padding: 8px 12px;
		background: #f5f5f5;
		border-radius: 10px;
	}

	.block-actions {
		display: flex;
		gap: 8px;
	}

	.flower-variant-toggle {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.flower-variant-btns {
		display: flex;
		gap: 4px;
		background: #eee;
		padding: 4px;
		border-radius: 8px;
	}

	.flower-variant-btn {
		font-family: var(--font);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 1.5px;
		padding: 8px 14px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		background: transparent;
		color: rgba(0,0,0,0.5);
		transition: all 0.2s;
		text-transform: uppercase;
		flex: 1;
	}

	.flower-variant-btn.active {
		background: #000000;
		color: #FFFFFF;
	}

	@media (max-width: 768px) {
		.detail-layout {
			grid-template-columns: 1fr;
		}

		.detail-preview {
			min-height: 240px;
			padding: 24px;
		}

		.detail-controls {
			padding: 24px;
		}

		.shape-grid {
			grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		}
	}
</style>
