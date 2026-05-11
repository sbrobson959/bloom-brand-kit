<script>
	import { reveal } from '$lib/utils/reveal.js';
</script>

<footer class="section section-white footer">
	<div class="footer-blobs" aria-hidden="true">
		<img src="/assets/blobs/sides/svg/side-left-carrot-kiwi-lychee.svg" alt="" class="footer-blob-left">
		<img src="/assets/blobs/sides/svg/side-right-kiwi-lychee-carrot.svg" alt="" class="footer-blob-right">
	</div>
	<div class="container">
		<div class="footer-content">
			<img src="/assets/logos/svg/bloom-only-true_black.svg" alt="Bloom" class="footer-logo">
			<p class="footer-tagline">BLOOM RESPONSIBLY</p>
			<p class="footer-small">© 2026 Bloom Juice Room. All rights reserved.</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		padding-top: 60px;
		padding-bottom: 40px;
		text-align: center;
		position: relative;
	}

	.footer-blobs {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.footer-blob-left,
	.footer-blob-right {
		position: absolute;
		height: 200px;
		opacity: 0.15;
		bottom: 0;
	}

	.footer-blob-left {
		left: -40px;
	}

	.footer-blob-right {
		right: -40px;
	}

	.footer-content {
		position: relative;
		z-index: 2;
	}

	.footer-logo {
		height: 40px;
		margin: 0 auto 20px;
	}

	.footer-tagline {
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 6px;
		text-transform: uppercase;
		color: #FE6705;
		margin-bottom: 16px;
	}

	.footer-small {
		font-size: 11px;
		letter-spacing: 1px;
		font-weight: 300;
		color: rgba(0,0,0,0.6);
	}
</style>
