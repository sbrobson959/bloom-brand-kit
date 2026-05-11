/**
 * Svelte action: reveal element on scroll using IntersectionObserver.
 * Usage: <div use:reveal>
 */
export function reveal(node, options = {}) {
	const threshold = options.threshold ?? 0.1;
	const className = options.className ?? 'visible';

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add(className);
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
