import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true,     // equivalent to '0.0.0.0', lets LAN devices connect
		port: 5173      // keep it consistent
	},
	resolve: {
		alias: {
			'$images': path.resolve('./static/images'),
			'$groups': path.resolve('./static/images/groups')
		}
	}
});
