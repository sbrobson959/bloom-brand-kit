<script>
	import { reveal } from '$lib/utils/reveal.js';
	import { COLOR_ORDER, COLOR_NAMES, COLORS, LOGO_VARIANTS, LOGO_VARIANT_NAMES } from '$lib/constants.js';
	import { downloadFile } from '$lib/utils/svgUtils.js';

	let currentVariant = 'horizontal';
	let currentColor = 'true_white';

	function updateLogo() {
		// reactive via assignment
	}

	function selectVariant(v) {
		currentVariant = v;
	}

	function selectColor(c) {
		currentColor = c;
	}

	function downloadSvg() {
		downloadFile(`/assets/logos/svg/bloom-${currentVariant}-${currentColor}.svg`, `bloom-${currentVariant}-${currentColor}.svg`);
	}

	function downloadPng() {
		downloadFile(`/assets/logos/png/bloom-${currentVariant}-${currentColor}.png`, `bloom-${currentVariant}-${currentColor}.png`);
	}

	function downloadAllSvg() {
		downloadFile('/zips/logos-svg.zip', 'bloom-logos-svg.zip');
	}

	function downloadAllPng() {
		downloadFile('/zips/logos-png.zip', 'bloom-logos-png.zip');
	}

	$: logoSrc = `/assets/logos/svg/bloom-${currentVariant}-${currentColor}.svg`;
	$: isDarkBg = currentColor !== 'true_black';
	$: previewBg = currentColor === 'true_black' ? '#FFFFFF' : '#000000';
	$: previewBorder = currentColor === 'true_black' ? '2px solid #eee' : '2px solid transparent';
</script>

<section id="mark" class="section section-black">
	<div class="container">
		<h2 class="section-heading reveal" use:reveal>THE MARK</h2>
		<p class="section-sub reveal" use:reveal>Three variants in five colors.</p>

		<div class="mark-layout reveal" use:reveal>
			<div class="mark-controls">
				<div class="control-group">
					<span class="control-label">VARIANT</span>
					<div class="variant-selector">
						{#each LOGO_VARIANTS as v}
							<button
								class="variant-btn"
								class:active={currentVariant === v}
								on:click={() => selectVariant(v)}
							>
								{LOGO_VARIANT_NAMES[v].toUpperCase()}
							</button>
						{/each}
					</div>
				</div>

				<div class="control-group">
					<span class="control-label">COLOR</span>
					<div class="color-selector">
						{#each COLOR_ORDER as c}
							<button
								class="color-dot"
								class:active={currentColor === c}
								style="background: {COLORS[c]}"
								title={COLOR_NAMES[c]}
								on:click={() => selectColor(c)}
								aria-label={COLOR_NAMES[c]}
							></button>
						{/each}
					</div>
				</div>

				<div class="download-bar">
					<div class="download-row download-row-individual">
						<button class="btn btn-outline" on:click={downloadSvg}>SVG</button>
						<button class="btn btn-outline" on:click={downloadPng}>PNG</button>
					</div>
					<div class="download-row download-row-bulk">
						<button class="btn btn-primary" on:click={downloadAllSvg}>ALL SVGs</button>
						<button class="btn btn-primary" on:click={downloadAllPng}>ALL PNGs</button>
					</div>
				</div>
			</div>

			<div class="mark-preview">
				<div class="preview-card" style="background: {previewBg}; border: {previewBorder}">
					<img src={logoSrc} alt="Bloom logo" class="preview-logo">
				</div>
			</div>
		</div>

		<div class="logo-specs reveal" use:reveal>
			<div class="spec">
				<span class="spec-label">CLEAR SPACE</span>
				<span class="spec-value">1× the height of "B" on all sides</span>
			</div>
			<div class="spec">
				<span class="spec-label">MINIMUM SIZE</span>
				<span class="spec-value">120px wide (digital) / 1.5in wide (print)</span>
			</div>
		</div>
	</div>
</section>

<style>
	.mark-layout {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 48px;
		align-items: start;
	}

	.mark-controls {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.control-label {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 2px;
		color: rgba(255,255,255,0.4);
	}

	.variant-selector {
		display: flex;
		gap: 4px;
		background: rgba(255,255,255,0.08);
		padding: 4px;
		border-radius: 8px;
	}

	.variant-btn {
		font-family: var(--font);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 2px;
		padding: 10px 20px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		background: transparent;
		color: rgba(255,255,255,0.5);
		transition: all 0.2s;
		text-transform: uppercase;
		flex: 1;
	}

	.variant-btn.active {
		background: #FFFFFF;
		color: #000000;
	}

	.color-selector {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.download-bar {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 8px;
	}

	.download-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}

	.download-row .btn {
		width: 100%;
	}

	.mark-preview {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.preview-card {
		width: 100%;
		max-width: 520px;
		aspect-ratio: 4 / 3;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px;
		transition: background 0.3s, border-color 0.3s;
	}

	.preview-logo {
		max-height: 160px;
		width: auto;
		transition: opacity 0.3s;
	}

	.logo-specs {
		display: flex;
		gap: 40px;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 48px;
		padding-top: 48px;
		border-top: 1px solid rgba(255,255,255,0.1);
	}

	.spec {
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: center;
	}

	.spec-label {
		font-size: 10px;
		letter-spacing: 2px;
		opacity: 0.4;
	}

	.spec-value {
		font-size: 14px;
		font-weight: 600;
	}

	@media (max-width: 768px) {
		.mark-layout {
			grid-template-columns: 1fr;
		}

		.preview-card {
			aspect-ratio: 16 / 10;
		}

		.logo-specs {
			flex-direction: column;
			align-items: center;
			gap: 16px;
		}
	}
</style>
