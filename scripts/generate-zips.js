import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import JSZip from 'jszip';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, '../static/assets');
const zipsDir = path.resolve(__dirname, '../static/zips');

function ensureDir(dir) {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function addFilesToZip(zip, dir, prefix = '') {
	const items = fs.readdirSync(dir);
	for (const item of items) {
		const fullPath = path.join(dir, item);
		const zipPath = prefix ? `${prefix}/${item}` : item;
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			addFilesToZip(zip, fullPath, zipPath);
		} else {
			zip.file(zipPath, fs.readFileSync(fullPath));
		}
	}
}

async function createZip(name, sourceDir, subPath = '') {
	const zip = new JSZip();
	const fullSource = subPath ? path.join(sourceDir, subPath) : sourceDir;
	addFilesToZip(zip, fullSource);
	const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
	fs.writeFileSync(path.join(zipsDir, `${name}.zip`), buffer);
	console.log(`Generated ${name}.zip`);
}

export async function generateZips() {
	ensureDir(zipsDir);

	// Logos
	await createZip('logos-svg', assetsDir, 'logos/svg');
	await createZip('logos-png', assetsDir, 'logos/png');

	// Blobs
	await createZip('blobs-solid-svg', assetsDir, 'blobs/solid/svg');
	await createZip('blobs-solid-png', assetsDir, 'blobs/solid/png');
	await createZip('blobs-multicolor-svg', assetsDir, 'blobs/multicolor/svg');
	await createZip('blobs-multicolor-png', assetsDir, 'blobs/multicolor/png');
	await createZip('blobs-sides-svg', assetsDir, 'blobs/sides/svg');
	await createZip('blobs-sides-png', assetsDir, 'blobs/sides/png');

	// All blobs combined (separate SVG and PNG from each subcategory)
	async function createBlobsCombined(name, subdir) {
		const zip = new JSZip();
		const dirs = ['solid', 'multicolor', 'sides'];
		for (const d of dirs) {
			const fullPath = path.join(assetsDir, 'blobs', d, subdir);
			if (fs.existsSync(fullPath)) {
				addFilesToZip(zip, fullPath, `${d}_${subdir}`);
			}
		}
		const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
		fs.writeFileSync(path.join(zipsDir, `${name}.zip`), buffer);
		console.log(`Generated ${name}.zip`);
	}
	await createBlobsCombined('blobs-all-svg', 'svg');
	await createBlobsCombined('blobs-all-png', 'png');

	// Fix right-side blob SVGs: remove erroneous 6x scale that pushes content outside viewBox
	const sideBlobDir = path.join(assetsDir, 'blobs/sides/svg');
	if (fs.existsSync(sideBlobDir)) {
		fs.readdirSync(sideBlobDir).forEach(f => {
			if (f.startsWith('side-right-') && f.endsWith('.svg')) {
				const fp = path.join(sideBlobDir, f);
				let svg = fs.readFileSync(fp, 'utf-8');
				// Replace inner matrix(6,0,0,6,...) with identity matrix
				const fixed = svg.replace(/matrix\(6,0,0,6,[^)]+\)/g, 'matrix(1,0,0,1,0,0)');
				if (fixed !== svg) {
					fs.writeFileSync(fp, fixed);
					console.log(`  Fixed ${f} (removed 6x scale)`);
				}
			}
		});
	}

	// Generate missing dual flower SVGs (true_black and true_white petal combos)
	const FLOWER_COLORS = {
		carrot: '#FE6705',
		kiwi: '#C7D62A',
		lychee: '#FD7699',
		true_black: '#000000',
		true_white: '#FFFFFF'
	};
	const dualTemplatePath = path.join(assetsDir, 'flowers/svg/flower-carrot-kiwi.svg');
	const dualTemplate = fs.readFileSync(dualTemplatePath, 'utf-8');
	const missingDuals = [];
	['true_black', 'true_white'].forEach(petal => {
		Object.keys(FLOWER_COLORS).forEach(center => {
			if (center !== petal) {
				missingDuals.push({ petal, center, file: `flower-${petal}-${center}.svg` });
			}
		});
	});
	function generateDualSvg(template, petalColor, centerColor) {
		let svg = template.replace(/#FE6705/gi, '__PETAL__');
		svg = svg.replace(/#C7D62A/gi, '__CENTER__');
		svg = svg.replace(/__PETAL__/g, petalColor);
		svg = svg.replace(/__CENTER__/g, centerColor);
		return svg;
	}
	// Add missing dual SVGs to flowers-svg.zip (need to regenerate it)
	const flowersSvgZip = new JSZip();
	addFilesToZip(flowersSvgZip, path.join(assetsDir, 'flowers/svg'));
	missingDuals.forEach(({ petal, center, file }) => {
		flowersSvgZip.file(file, generateDualSvg(dualTemplate, FLOWER_COLORS[petal], FLOWER_COLORS[center]));
	});
	const flowersSvgBuffer = await flowersSvgZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
	fs.writeFileSync(path.join(zipsDir, 'flowers-svg.zip'), flowersSvgBuffer);
	console.log(`Generated flowers-svg.zip (${missingDuals.length} missing duals added)`);
	// Try to generate PNGs for missing duals (rsvg-convert may not be available in all environments)
	let pngsGenerated = 0;
	try {
		execSync('which rsvg-convert', { stdio: 'ignore' });
		const pngTempDir = path.join(zipsDir, '.tmp-png');
		ensureDir(pngTempDir);
		missingDuals.forEach(({ petal, center, file }) => {
			const svgPath = path.join(pngTempDir, file);
			const pngFile = file.replace('.svg', '.png');
			fs.writeFileSync(svgPath, generateDualSvg(dualTemplate, FLOWER_COLORS[petal], FLOWER_COLORS[center]));
			execSync(`rsvg-convert "${svgPath}" -o "${path.join(pngTempDir, pngFile)}"`, { stdio: 'ignore' });
			pngsGenerated++;
		});
		// Regenerate flowers-png.zip with generated PNGs
		const flowersPngZip = new JSZip();
		addFilesToZip(flowersPngZip, path.join(assetsDir, 'flowers/png'));
		fs.readdirSync(pngTempDir).forEach(f => {
			if (f.endsWith('.png')) {
				flowersPngZip.file(f, fs.readFileSync(path.join(pngTempDir, f)));
			}
		});
		const flowersPngBuffer = await flowersPngZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
		fs.writeFileSync(path.join(zipsDir, 'flowers-png.zip'), flowersPngBuffer);
		console.log(`Generated flowers-png.zip (${pngsGenerated} missing dual PNGs added)`);
		fs.rmSync(pngTempDir, { recursive: true, force: true });
	} catch {
		console.log('rsvg-convert not available — missing dual PNGs omitted from flowers-png.zip');
	}

	// Fonts
	const fontsZip = new JSZip();
	fontsZip.file('Comfortaa-VariableFont_wght.ttf', fs.readFileSync(path.resolve(__dirname, '../static/Comfortaa-VariableFont_wght.ttf')));
	fontsZip.file('Comfortaa-Regular.ttf', fs.readFileSync(path.join(assetsDir, 'comfortaa/Comfortaa-Regular.ttf')));
	fontsZip.file('Comfortaa-Regular.woff', fs.readFileSync(path.join(assetsDir, 'comfortaa/Comfortaa-Regular.woff')));
	fontsZip.file('Comfortaa-Regular.woff2', fs.readFileSync(path.join(assetsDir, 'comfortaa/Comfortaa-Regular.woff2')));
	const fontsBuffer = await fontsZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
	fs.writeFileSync(path.join(zipsDir, 'fonts.zip'), fontsBuffer);
	console.log('Generated fonts.zip');
}

// Allow running standalone
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	generateZips().catch(console.error);
}
