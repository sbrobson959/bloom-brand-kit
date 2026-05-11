<script>
	import { reveal } from '$lib/utils/reveal.js';
	import { COLOR_ORDER, COLOR_NAMES, COLORS } from '$lib/constants.js';

	let toastMsg = '';
	let toastVisible = false;
	let toastTimer;

	function showToast(msg) {
		clearTimeout(toastTimer);
		toastMsg = msg;
		toastVisible = true;
		toastTimer = setTimeout(() => toastVisible = false, 2000);
	}

	function copyHex(hex) {
		navigator.clipboard.writeText(hex).then(() => {
			showToast(`Copied ${hex}!`);
		}).catch(() => {
			showToast(`${hex} — copy manually`);
		});
	}

	const rgb = (hex) => {
		const n = parseInt(hex.slice(1), 16);
		return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
	};

	const cmyk = (hex) => {
		const r = parseInt(hex.slice(1, 3), 16) / 255;
		const g = parseInt(hex.slice(3, 5), 16) / 255;
		const b = parseInt(hex.slice(5, 7), 16) / 255;
		const k = 1 - Math.max(r, g, b);
		const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
		const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
		const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
		return `${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%`;
	};
</script>

<section id="palette" class="section section-white">
	<div class="container">
		<h2 class="section-heading reveal" use:reveal>THE PALETTE</h2>
		<p class="section-sub reveal" use:reveal>Five colors. No exceptions. Click any swatch to copy the HEX code.</p>

		<div class="swatch-grid reveal" use:reveal>
			{#each COLOR_ORDER as key}
				{@const hex = COLORS[key]}
				{@const isDark = key === 'true_black'}
				<button
					class="swatch"
					style="background: {hex}; color: {isDark ? '#FFFFFF' : '#000000'}"
					on:click={() => copyHex(hex)}
					aria-label="Copy {COLOR_NAMES[key]} {hex}"
				>
					<div class="swatch-info">
						<span class="swatch-name">{COLOR_NAMES[key].toUpperCase()}</span>
						<span class="swatch-hex">{hex}</span>
						<span class="swatch-detail">RGB {rgb(hex)}</span>
						<span class="swatch-detail">CMYK {cmyk(hex)}</span>
					</div>
					<svg class="copy-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
					</svg>
				</button>
			{/each}
		</div>
	</div>
</section>

<div class="toast" class:show={toastVisible}>{toastMsg}</div>

<style>
	.swatch-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 12px;
	}

	.swatch {
		height: 200px;
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 24px;
		cursor: pointer;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		position: relative;
		border: 1px solid rgba(0,0,0,0.15);
		font-family: var(--font);
		text-align: left;
	}

	.swatch:hover {
		transform: translateY(-6px) scale(1.02);
		box-shadow: 0 16px 48px rgba(0,0,0,0.12);
	}

	.swatch-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.swatch-name {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 2px;
	}

	.swatch-hex {
		font-size: 12px;
		opacity: 0.8;
		font-weight: 600;
	}

	.swatch-detail {
		font-size: 11px;
		opacity: 0.6;
		font-weight: 400;
	}

	.copy-icon {
		position: absolute;
		top: 20px;
		right: 20px;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.swatch:hover .copy-icon {
		opacity: 0.6;
	}

	@media (max-width: 768px) {
		.swatch-grid {
			grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		}
		.swatch {
			height: 160px;
		}
	}

	@media (max-width: 480px) {
		.swatch-grid {
			grid-template-columns: 1fr;
		}
		.swatch {
			height: 120px;
		}
	}
</style>
