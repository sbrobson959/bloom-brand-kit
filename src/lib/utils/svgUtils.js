/**
 * Fetch an SVG, parse it, find unique fill colors, and allow swapping them.
 * Returns { svgText, originalColors, getModifiedSvg(colorMap) }
 */
export async function loadSvgForEditing(url) {
	const res = await fetch(url);
	const svgText = await res.text();
	const parser = new DOMParser();
	const doc = parser.parseFromString(svgText, 'image/svg+xml');
	const svg = doc.querySelector('svg');
	if (!svg) return null;

	const fills = new Set();
	const elements = svg.querySelectorAll('[fill]');
	elements.forEach(el => {
		const fill = el.getAttribute('fill');
		if (fill && fill.toLowerCase() !== 'none') {
			fills.add(fill.toUpperCase());
		}
	});

	const originalColors = Array.from(fills);

	function getModifiedSvg(colorMap) {
		// Clone the svg element by serializing and re-parsing
		const cloned = svg.cloneNode(true);
		const clonedEls = cloned.querySelectorAll('[fill]');
		clonedEls.forEach(el => {
			const fill = el.getAttribute('fill').toUpperCase();
			for (const [orig, replacement] of Object.entries(colorMap)) {
				if (fill === orig.toUpperCase()) {
					el.setAttribute('fill', replacement);
					break;
				}
			}
		});
		const serializer = new XMLSerializer();
		return serializer.serializeToString(cloned);
	}

	return { svgText, originalColors, getModifiedSvg };
}

/**
 * Render an SVG string to a PNG Blob and trigger download.
 * Preserves aspect ratio based on viewBox, with a max dimension of 1200px.
 */
export function downloadSvgAsPng(svgString, filename) {
	return new Promise((resolve, reject) => {
		// Parse viewBox to determine aspect ratio
		let width = 800, height = 800;
		const viewBoxMatch = svgString.match(/viewBox=["']([^"']+)["']/);
		if (viewBoxMatch) {
			const parts = viewBoxMatch[1].split(/[\s,]+/).map(Number);
			if (parts.length === 4) {
				const vbW = parts[2];
				const vbH = parts[3];
				const maxDim = 1200;
				if (vbW > vbH) {
					width = maxDim;
					height = Math.round(maxDim * (vbH / vbW));
				} else {
					height = maxDim;
					width = Math.round(maxDim * (vbW / vbH));
				}
			}
		}

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		if (!ctx) return reject(new Error('No 2d context'));

		// Ensure SVG has xmlns for reliable rendering
		let svg = svgString;
		if (!svg.includes('xmlns=')) {
			svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
		}

		const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const img = new Image();

		img.onload = () => {
			ctx.drawImage(img, 0, 0, width, height);
			URL.revokeObjectURL(url);
			canvas.toBlob((pngBlob) => {
				if (!pngBlob) return reject(new Error('PNG conversion failed'));
				const a = document.createElement('a');
				a.href = URL.createObjectURL(pngBlob);
				a.download = filename.replace('.svg', '.png');
				a.style.display = 'none';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				resolve();
			}, 'image/png');
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Image load failed'));
		};

		img.src = url;
	});
}

/**
 * Trigger a file download from a URL.
 */
export function downloadFile(url, filename) {
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
