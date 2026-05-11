<script>
	import { reveal } from '$lib/utils/reveal.js';
	import { downloadFile } from '$lib/utils/svgUtils.js';
	import { downloadStaticZip } from '$lib/utils/zipUtils.js';

	let h1Text = 'BLOOM JUICE ROOM';
	let h2Text = 'BLOOM RESPONSIBLY';
	let h3Text = '100% PLANT BASED';
	let bodyText = 'Bloom Juice Room is a modern juice company rooted in simplicity. We take the finest fruits and vegetables, cold-press them to preserve every nutrient, and bottle pure flavor. No compromises.';
	let captionText = '16.9 FL OZ | 500 ML';

	function enforceCaps(node) {
		const el = node;
		el.addEventListener('input', () => {
			const selection = window.getSelection();
			const range = selection.getRangeAt(0);
			const cursorOffset = range.startOffset;
			el.textContent = el.textContent.toUpperCase();
			const newRange = document.createRange();
			const newSel = window.getSelection();
			if (el.firstChild) {
				newRange.setStart(el.firstChild, Math.min(cursorOffset, el.textContent.length));
				newRange.collapse(true);
				newSel.removeAllRanges();
				newSel.addRange(newRange);
			}
		});
		el.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') e.preventDefault();
		});
	}

	const fontFormats = [
		{ label: 'VARIABLE TTF', desc: 'Weight 300–700', url: './Comfortaa-VariableFont_wght.ttf', file: 'Comfortaa-VariableFont_wght.ttf' },
		{ label: 'REGULAR TTF', desc: 'TrueType font', url: '/assets/comfortaa/Comfortaa-Regular.ttf', file: 'Comfortaa-Regular.ttf' },
		{ label: 'WOFF', desc: 'Web font', url: '/assets/comfortaa/Comfortaa-Regular.woff', file: 'Comfortaa-Regular.woff' },
		{ label: 'WOFF2', desc: 'Compressed web font', url: '/assets/comfortaa/Comfortaa-Regular.woff2', file: 'Comfortaa-Regular.woff2' },
	];

	function downloadFont(format) {
		downloadFile(format.url, format.file);
	}

	function downloadAllFonts() {
		downloadStaticZip('/zips/fonts.zip', 'bloom-fonts.zip');
	}
</script>

<section id="type" class="section section-black">
	<div class="container">
		<h2 class="section-heading reveal" use:reveal>THE TYPE</h2>
		<p class="section-sub reveal" use:reveal>Comfortaa — the only typeface. Headlines are always all-caps.</p>

		<div class="type-top reveal" use:reveal>
			<div class="type-download-card">
				<div class="type-download-info">
					<h3>COMFORTAA</h3>
					<p>Variable weight font (300–700). Available in TTF, WOFF, and WOFF2.</p>
				</div>
				<div class="font-formats">
					{#each fontFormats as f}
						<button class="font-format-btn" on:click={() => downloadFont(f)}>
							<span class="ff-label">{f.label}</span>
							<span class="ff-desc">{f.desc}</span>
						</button>
					{/each}
					<button class="font-format-btn font-format-all" on:click={downloadAllFonts}>
						<span class="ff-label">ALL FONTS</span>
						<span class="ff-desc">ZIP archive (4 files)</span>
					</button>
				</div>
			</div>
		</div>

		<div class="type-showcase reveal" use:reveal>
			<div class="type-row">
				<span class="type-label">H1</span>
				<div class="type-sample type-h1" contenteditable="true" use:enforceCaps bind:textContent={h1Text}></div>
			</div>
			<div class="type-row">
				<span class="type-label">H2</span>
				<div class="type-sample type-h2" contenteditable="true" use:enforceCaps bind:textContent={h2Text}></div>
			</div>
			<div class="type-row">
				<span class="type-label">H3</span>
				<div class="type-sample type-h3" contenteditable="true" use:enforceCaps bind:textContent={h3Text}></div>
			</div>
			<div class="type-row">
				<span class="type-label">BODY</span>
				<div class="type-sample type-body" contenteditable="true" bind:textContent={bodyText}></div>
			</div>
			<div class="type-row">
				<span class="type-label">CAPTION</span>
				<div class="type-sample type-caption" contenteditable="true" bind:textContent={captionText}></div>
			</div>
		</div>
	</div>
</section>

<style>
	.type-top {
		margin-bottom: 48px;
	}

	.type-download-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 32px;
		border-radius: 16px;
		background: rgba(255,255,255,0.05);
		border: 1px solid rgba(255,255,255,0.1);
		flex-wrap: wrap;
	}

	.type-download-info h3 {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 3px;
		margin-bottom: 8px;
	}

	.type-download-info p {
		font-size: 14px;
		opacity: 0.6;
		margin: 0;
		max-width: 400px;
	}

	.type-showcase {
		background: rgba(255,255,255,0.03);
		border-radius: 16px;
		padding: 32px;
		border: 1px solid rgba(255,255,255,0.06);
	}

	.type-row {
		display: flex;
		align-items: flex-start;
		gap: 24px;
		padding: 20px 0;
		border-bottom: 1px solid rgba(255,255,255,0.08);
	}

	.type-row:last-child {
		border-bottom: none;
	}

	.type-label {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 2px;
		color: rgba(255,255,255,0.3);
		min-width: 80px;
		padding-top: 4px;
		flex-shrink: 0;
	}

	.type-sample {
		flex: 1;
		outline: none;
		padding: 4px 0;
		border-radius: 4px;
		transition: background 0.2s;
		min-width: 0;
	}

	.type-sample:focus {
		background: rgba(255,255,255,0.05);
	}

	.type-h1 {
		font-size: clamp(32px, 5vw, 56px);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 3px;
		line-height: 1.2;
	}

	.type-h2 {
		font-size: clamp(26px, 4vw, 42px);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 2px;
		line-height: 1.2;
	}

	.type-h3 {
		font-size: clamp(20px, 3vw, 32px);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 2px;
		line-height: 1.3;
	}

	.type-body {
		font-size: 16px;
		font-weight: 400;
		line-height: 1.7;
	}

	.type-caption {
		font-size: 13px;
		font-weight: 300;
		letter-spacing: 1.5px;
	}

	.font-formats {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.font-format-btn {
		font-family: var(--font);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
		padding: 12px 18px;
		border-radius: 10px;
		border: 1px solid rgba(255,255,255,0.15);
		background: rgba(255,255,255,0.06);
		color: #fff;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.font-format-btn:hover {
		background: rgba(255,255,255,0.12);
		border-color: rgba(255,255,255,0.3);
		transform: translateY(-2px);
	}

	.font-format-all {
		background: #FE6705;
		color: #fff;
		border-color: #FE6705;
	}

	.font-format-all:hover {
		background: #e05a00;
		border-color: #e05a00;
	}

	.ff-label {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 1.5px;
	}

	.ff-desc {
		font-size: 10px;
		opacity: 0.5;
		font-weight: 400;
	}

	@media (max-width: 768px) {
		.type-download-card {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
