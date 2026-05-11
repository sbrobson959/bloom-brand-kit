import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { generateZips } from './scripts/generate-zips.js';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'generate-zips',
			async buildStart() {
				await generateZips();
			}
		}
	]
});
