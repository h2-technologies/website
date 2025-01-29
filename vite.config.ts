import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ".h2technologiesllc.com",
	},
	preview: {
                allowedHosts: [".h2technologiesllc.com"],
        },
});
