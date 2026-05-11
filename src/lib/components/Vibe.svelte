<script>
	import { reveal } from '$lib/utils/reveal.js';
</script>

<section id="vibe" class="section section-white">
	<div class="container">
		<h2 class="section-heading reveal" use:reveal>
			<img src="/assets/flowers/svg/flower-kiwi-lychee.svg" alt="" class="vibe-flower">
			THE VIBE
		</h2>
		<div class="content-block reveal" use:reveal>
			<p class="lede">Bloom Juice Room is cold-pressed juice with a feel-good attitude. Real ingredients, bold flavors, and a brand that doesn't take itself too seriously.</p>
			<p>Every sip is crafted from 100% plant-based ingredients — no added sugar, no preservatives, always fresh. Whether you're glowing, renewing, or just thirsty, Bloom is here to make your day a little brighter.</p>
		</div>
		<div class="traits reveal" use:reveal>
			<div class="trait-card">
				<img src="/assets/flowers/svg/flower-carrot-filled.svg" alt="" class="trait-bullet">
				<h3>FUN</h3>
				<p>Juice should make you feel good and put a smile on your face.</p>
			</div>
			<div class="trait-card">
				<img src="/assets/flowers/svg/flower-kiwi-filled.svg" alt="" class="trait-bullet">
				<h3>VIBRANT</h3>
				<p>Fresh, lively, full of energy — like the ingredients we use.</p>
			</div>
			<div class="trait-card">
				<img src="/assets/flowers/svg/flower-lychee-filled.svg" alt="" class="trait-bullet">
				<h3>APPROACHABLE</h3>
				<p>Premium quality that feels welcoming, not intimidating.</p>
			</div>
		</div>
	</div>
</section>

<style>
	#vibe .section-heading {
		display: flex;
		align-items: center;
		gap: 0.2em;
	}

	.vibe-flower {
		flex-shrink: 0;
		height: 0.75em;
		width: auto;
		margin-top: -0.1em;
		animation: gentleSpin 16s linear infinite;
	}

	@keyframes gentleSpin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.content-block {
		max-width: 800px;
	}

	.lede {
		font-size: 22px;
		font-weight: 600;
		line-height: 1.5;
		margin-bottom: 16px;
	}

	.traits {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 32px;
		margin-top: 60px;
	}

	.trait-card {
		padding: 32px;
		border-radius: 16px;
		background: #FFFFFF;
		border-top: 4px solid #FE6705;
		box-shadow: 0 4px 20px rgba(0,0,0,0.06);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.trait-card:nth-child(2) { border-top-color: #C7D62A; }
	.trait-card:nth-child(3) { border-top-color: #FD7699; }

	.trait-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 40px rgba(0,0,0,0.08);
	}

	.trait-bullet {
		width: 32px;
		margin-bottom: 16px;
		transition: transform 0.3s ease;
	}

	.trait-card:hover .trait-bullet {
		transform: scale(1.2) rotate(12deg);
	}

	.trait-card h3 {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 3px;
		margin-bottom: 12px;
	}

	.trait-card p {
		font-size: 14px;
		opacity: 0.7;
		margin: 0;
	}

	@media (max-width: 768px) {
		.traits {
			grid-template-columns: 1fr;
		}
	}
</style>
