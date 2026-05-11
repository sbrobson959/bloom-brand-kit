<script>
	import { onMount } from 'svelte';

	let cloudEl;

	onMount(() => {
		if (!cloudEl) return;

		const cloudBlobs = [];
		const solidColors = ['carrot', 'kiwi', 'lychee'];
		const multicolorSets = ['carrot-kiwi-lychee', 'kiwi-lychee-carrot', 'lychee-carrot-kiwi'];
		const numBlobs = 8;

		function startOffScreen() {
			const side = Math.floor(Math.random() * 4);
			const margin = 12;
			switch (side) {
				case 0: return { x: -(margin + Math.random() * 25), y: Math.random() * 100 };
				case 1: return { x: 100 + margin + Math.random() * 25, y: Math.random() * 100 };
				case 2: return { x: Math.random() * 100, y: -(margin + Math.random() * 25) };
				case 3: return { x: Math.random() * 100, y: 100 + margin + Math.random() * 25 };
			}
		}

		function startOnScreen() {
			const quad = Math.floor(Math.random() * 4);
			switch (quad) {
				case 0: return { x: 5 + Math.random() * 42, y: 5 + Math.random() * 42 };
				case 1: return { x: 53 + Math.random() * 42, y: 5 + Math.random() * 42 };
				case 2: return { x: 5 + Math.random() * 42, y: 53 + Math.random() * 42 };
				case 3: return { x: 53 + Math.random() * 42, y: 53 + Math.random() * 42 };
			}
		}

		function isOffScreen(x, y) {
			const m = 20;
			return x < -m || x > 100 + m || y < -m || y > 100 + m;
		}

		for (let i = 0; i < numBlobs; i++) {
			const img = document.createElement('img');
			img.className = 'cloud-blob';
			img.alt = '';

			const useMulticolor = i >= 4;
			if (useMulticolor) {
				const blend = multicolorSets[i % multicolorSets.length];
				const multiNums = [2,3,5,6,7,8,9,10,11,12,13,14,15];
				const num = String(multiNums[Math.floor(Math.random() * multiNums.length)]).padStart(2, '0');
				img.src = `/assets/blobs/multicolor/svg/blob-${num}-${blend}.svg`;
			} else {
				const color = solidColors[i % 3];
				const num = String(Math.floor(Math.random() * 20) + 1).padStart(2, '0');
				img.src = `/assets/blobs/solid/svg/blob-${num}-${color}.svg`;
			}

			const size = 150 + Math.random() * 350;
			const startsOnScreen = i < 4;
			const pos = startsOnScreen ? startOnScreen() : startOffScreen();
			const angle = Math.random() * Math.PI * 2;
			const baseSpeed = 0.75 + Math.random() * 1.25;
			const speed = baseSpeed * (150 / size);
			const rotDir = Math.random() < 0.5 ? 1 : -1;
			const rotSpeed = 2.5 + Math.random() * 12.5;
			const opacity = 0.45 + Math.random() * 0.55;

			cloudBlobs.push({
				el: img, x: pos.x, y: pos.y,
				angle, speed, rotSpeed: rotDir * rotSpeed,
				rotation: Math.random() * 360,
				parallaxFactor: (150 / size) * (0.08 + Math.random() * 0.06),
			});

			img.style.cssText = `
				left: ${pos.x}%;
				top: ${pos.y}%;
				width: ${size}px;
				opacity: ${opacity};
				transform: rotate(${Math.random() * 360}deg);
			`;
			cloudEl.appendChild(img);
		}

		let lastTime = performance.now();
		let speedBoost = 1;
		let targetBoost = 1;
		let lastScrollY = window.scrollY;
		let scrollTime = performance.now();

		window.addEventListener('scroll', () => {
			const now = performance.now();
			const dt = Math.min(now - scrollTime, 200);
			const dY = Math.abs(window.scrollY - lastScrollY);
			const vel = dY / Math.max(dt, 16);
			targetBoost = 1 + Math.min(vel * 4, 3);
			lastScrollY = window.scrollY;
			scrollTime = now;
		}, { passive: true });

		let rafId;
		function updateCloud(time) {
			const dt = Math.min((time - lastTime) / 1000, 0.1);
			lastTime = time;

			if (Math.abs(window.scrollY - lastScrollY) < 2) {
				if (targetBoost > 1) {
					targetBoost *= 0.85;
					if (targetBoost < 1) targetBoost = 1;
				}
			}
			speedBoost += (targetBoost - speedBoost) * 0.08;

			cloudBlobs.forEach((b) => {
				b.x += Math.cos(b.angle) * b.speed * speedBoost * dt;
				b.y += Math.sin(b.angle) * b.speed * speedBoost * dt;
				b.rotation += b.rotSpeed * speedBoost * dt;

				const parallaxY = window.scrollY * b.parallaxFactor;

				b.el.style.left = `${b.x}%`;
				b.el.style.top = `${b.y}%`;
				b.el.style.transform = `translateY(${parallaxY}px) rotate(${b.rotation}deg)`;

				if (isOffScreen(b.x, b.y)) {
					const pos = startOffScreen();
					b.x = pos.x; b.y = pos.y;
					b.angle = Math.random() * Math.PI * 2;
				}
			});

			rafId = requestAnimationFrame(updateCloud);
		}

		rafId = requestAnimationFrame(updateCloud);

		return () => cancelAnimationFrame(rafId);
	});
</script>

<section id="hero" class="section section-black section-hero">
	<div class="blob-cloud" bind:this={cloudEl}></div>
	<div class="hero-content">
		<img src="/assets/logos/svg/bloom-vertical-true_white.svg" alt="Bloom Juice Room" class="hero-logo">
		<p class="hero-tagline">BRAND KIT</p>
	</div>
	<div class="scroll-hint">SCROLL</div>
</section>

<style>
	.section-hero {
		min-height: 55vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 60px;
		padding-bottom: 40px;
	}

	.blob-cloud {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 1;
	}

	:global(.cloud-blob) {
		position: absolute;
		will-change: transform;
	}

	.hero-content {
		text-align: center;
		z-index: 3;
		position: relative;
		max-width: 700px;
		margin: 0 auto;
	}

	.hero-logo {
		width: 700px;
		max-width: 100%;
		height: auto;
		display: block;
		margin: 0 auto;
	}

	.hero-tagline {
		font-size: clamp(16px, 2.5vw, 28px);
		font-weight: 600;
		letter-spacing: 10px;
		text-transform: uppercase;
		color: #FFFFFF;
		margin-top: 24px;
	}

	.scroll-hint {
		position: absolute;
		bottom: 40px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 11px;
		letter-spacing: 4px;
		color: rgba(255,255,255,0.3);
		animation: scrollPulse 2s ease-in-out infinite;
	}

	@keyframes scrollPulse {
		0%, 100% { opacity: 0.3; transform: translateX(-50%) translateY(0); }
		50% { opacity: 1; transform: translateX(-50%) translateY(8px); }
	}
</style>
