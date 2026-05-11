<script>
	import { onMount } from 'svelte';

	let mobileOpen = false;
	let navVisible = false;
	let navEl;

	const links = [
		{ label: 'VIBE', href: '#vibe' },
		{ label: 'MARK', href: '#mark' },
		{ label: 'PALETTE', href: '#palette' },
		{ label: 'TYPE', href: '#type' },
		{ label: 'GRAPHICS', href: '#graphics' },
		{ label: 'TOOLS', href: '#tools' }
	];

	onMount(() => {
		const onScroll = () => {
			if (window.scrollY > 100 && !navVisible) {
				navVisible = true;
			} else if (window.scrollY <= 100 && navVisible) {
				navVisible = false;
			}
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function scrollTo(e, href) {
		e.preventDefault();
		const el = document.querySelector(href);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
		mobileOpen = false;
	}
</script>

<nav class="nav" bind:this={navEl} class:scrolled={navVisible}>
	<div class="nav-inner">
		<a href="#hero" class="nav-logo" on:click={(e) => scrollTo(e, '#hero')}>
			<img src="/assets/logos/svg/bloom-only-true_white.svg" alt="Bloom" class="nav-logo-img">
		</a>

		<div class="nav-links">
			{#each links as link}
				<a href={link.href} on:click={(e) => scrollTo(e, link.href)}>{link.label}</a>
			{/each}
		</div>

		<button class="hamburger" on:click={() => mobileOpen = !mobileOpen} aria-label="Toggle menu">
			<span class:open={mobileOpen}></span>
			<span class:open={mobileOpen}></span>
			<span class:open={mobileOpen}></span>
		</button>
	</div>

	{#if mobileOpen}
		<div class="mobile-menu">
			{#each links as link}
				<a href={link.href} on:click={(e) => scrollTo(e, link.href)}>{link.label}</a>
			{/each}
		</div>
	{/if}
</nav>

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: rgba(0,0,0,0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		padding: 0 24px;
		transition: background 0.3s;
	}

	.nav.scrolled {
		background: rgba(0,0,0,0.95);
	}

	.nav-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60px;
	}

	.nav-logo {
		display: flex;
		align-items: center;
	}

	.nav-logo-img {
		height: 28px;
		width: auto;
		display: block;
	}

	.nav-links {
		display: flex;
		gap: 20px;
	}

	.nav-links a {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 1.5px;
		color: rgba(255,255,255,0.6);
		transition: color 0.2s;
		text-transform: uppercase;
	}

	.nav-links a:hover {
		color: #FFFFFF;
	}

	.hamburger {
		display: none;
		flex-direction: column;
		gap: 5px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
	}

	.hamburger span {
		display: block;
		width: 24px;
		height: 2px;
		background: #FFFFFF;
		transition: all 0.3s;
		border-radius: 2px;
	}

	.hamburger span:nth-child(1).open {
		transform: translateY(7px) rotate(45deg);
	}

	.hamburger span:nth-child(2).open {
		opacity: 0;
	}

	.hamburger span:nth-child(3).open {
		transform: translateY(-7px) rotate(-45deg);
	}

	.mobile-menu {
		display: none;
		flex-direction: column;
		gap: 16px;
		padding: 20px 24px 24px;
		background: rgba(0,0,0,0.95);
		border-top: 1px solid rgba(255,255,255,0.1);
	}

	.mobile-menu a {
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 2px;
		color: rgba(255,255,255,0.8);
		text-transform: uppercase;
		transition: color 0.2s;
	}

	.mobile-menu a:hover {
		color: #FFFFFF;
	}

	@media (max-width: 768px) {
		.nav-links { display: none; }
		.hamburger { display: flex; }
		.mobile-menu { display: flex; }
	}
</style>
