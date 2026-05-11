import JSZip from 'jszip';
import pkg from 'file-saver';
const { saveAs } = pkg;

/**
 * Fetch multiple files, zip them, and trigger download.
 */
export async function downloadAsZip(files, zipName) {
	const zip = new JSZip();
	const folder = zip.folder(zipName.replace('.zip', ''));

	await Promise.all(
		files.map(async ({ url, name }) => {
			try {
				const res = await fetch(url);
				const blob = await res.blob();
				folder.file(name, blob);
			} catch (e) {
				console.warn('Failed to fetch', url, e);
			}
		})
	);

	const content = await zip.generateAsync({ type: 'blob' });
	saveAs(content, zipName);
}

/**
 * Download a pre-built static zip file.
 */
export function downloadStaticZip(zipUrl, zipName) {
	const a = document.createElement('a');
	a.href = zipUrl;
	a.download = zipName;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
