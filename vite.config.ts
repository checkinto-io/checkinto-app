import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true,     // equivalent to '0.0.0.0', lets LAN devices connect
		port: 5173      // keep it consistent
	}
});
