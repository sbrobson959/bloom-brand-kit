<script>
	import { reveal } from '$lib/utils/reveal.js';
	import { downloadStaticZip } from '$lib/utils/zipUtils.js';
	import { downloadFile } from '$lib/utils/svgUtils.js';

	const tools = [
		{
			title: 'LOGOS',
			accent: '#FE6705',
			count: '15 SVGs + 15 PNGs',
			items: [
				{ label: 'SVGs', action: () => downloadStaticZip('/zips/logos-svg.zip', 'bloom-logos-svg.zip') },
				{ label: 'PNGs', action: () => downloadStaticZip('/zips/logos-png.zip', 'bloom-logos-png.zip') }
			]
		},
		{
			title: 'FLOWERS',
			accent: '#C7D62A',
			count: '22 SVGs + 22 PNGs',
			items: [
				{ label: 'SVGs', action: () => downloadStaticZip('/zips/flowers-svg.zip', 'bloom-flowers-svg.zip') },
				{ label: 'PNGs', action: () => downloadStaticZip('/zips/flowers-png.zip', 'bloom-flowers-png.zip') }
			]
		},
		{
			title: 'BLOBS',
			accent: '#FD7699',
			count: '202 SVGs + 202 PNGs',
			items: [
				{ label: 'Solid SVGs', action: () => downloadStaticZip('/zips/blobs-solid-svg.zip', 'blobs-solid-svg.zip') },
				{ label: 'Solid PNGs', action: () => downloadStaticZip('/zips/blobs-solid-png.zip', 'blobs-solid-png.zip') },
				{ label: 'Multicolor SVGs', action: () => downloadStaticZip('/zips/blobs-multicolor-svg.zip', 'blobs-multicolor-svg.zip') },
				{ label: 'Multicolor PNGs', action: () => downloadStaticZip('/zips/blobs-multicolor-png.zip', 'blobs-multicolor-png.zip') },
				{ label: 'Sides SVGs', action: () => downloadStaticZip('/zips/blobs-sides-svg.zip', 'blobs-sides-svg.zip') },
				{ label: 'Sides PNGs', action: () => downloadStaticZip('/zips/blobs-sides-png.zip', 'blobs-sides-png.zip') }
			]
		},
		{
			title: 'FONTS',
			accent: '#FFFFFF',
			count: '4 files',
			items: [
				{ label: 'Variable TTF', action: () => downloadFile('./Comfortaa-VariableFont_wght.ttf', 'Comfortaa-VariableFont_wght.ttf') },
				{ label: 'Regular TTF', action: () => downloadFile('/assets/comfortaa/Comfortaa-Regular.ttf', 'Comfortaa-Regular.ttf') },
				{ label: 'Regular WOFF', action: () => downloadFile('/assets/comfortaa/Comfortaa-Regular.woff', 'Comfortaa-Regular.woff') },
				{ label: 'Regular WOFF2', action: () => downloadFile('/assets/comfortaa/Comfortaa-Regular.woff2', 'Comfortaa-Regular.woff2') },
				{ label: 'All Fonts ZIP', action: () => downloadStaticZip('/zips/fonts.zip', 'bloom-fonts.zip') }
			]
		}
	];
</script>

<section id="tools" class="section section-black">
	<div class="container">
		<h2 class="section-heading reveal" use:reveal>THE TOOLS</h2>
		<p class="section-sub reveal" use:reveal>Everything you need to work with the Bloom brand.</p>

		<div class="tools-grid reveal" use:reveal>
			{#each tools as tool}
				<div class="tool-card" style="border-top-color: {tool.accent}">
					<div class="tool-header">
						<h3>{tool.title}</h3>
						<span class="tool-count">{tool.count}</span>
					</div>
					<div class="tool-actions">
						{#each tool.items as item}
							<button class="tool-btn" on:click={item.action}>{item.label}</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 24px;
	}

	.tool-card {
		background: #1a1a1a;
		border-radius: 16px;
		border-top: 4px solid;
		padding: 32px;
		transition: transform 0.3s ease;
	}

	.tool-card:hover {
		transform: translateY(-4px);
	}

	.tool-header {
		margin-bottom: 24px;
	}

	.tool-header h3 {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 3px;
		margin-bottom: 4px;
		color: #FFFFFF;
	}

	.tool-count {
		font-size: 12px;
		opacity: 0.4;
		font-weight: 400;
		color: rgba(255,255,255,0.5);
	}

	.tool-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tool-btn {
		font-family: var(--font);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 1.5px;
		padding: 10px 18px;
		border: 2px solid rgba(255,255,255,0.3);
		border-radius: 8px;
		background: transparent;
		color: #FFFFFF;
		cursor: pointer;
		text-transform: uppercase;
		transition: all 0.2s;
	}

	.tool-btn:hover {
		background: #FFFFFF;
		color: #000000;
		transform: translateY(-2px);
	}

	@media (max-width: 768px) {
		.tools-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
