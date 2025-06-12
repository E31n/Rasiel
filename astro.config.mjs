// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
    integrations: [svelte()],
    vite: {
        plugins: [tailwindcss()],
        server: {
            allowedHosts: ['.ngrok-free.app'], // ✅ allow any ngrok tunnel
        },
    },
    // site: 'https://e31n.github.io',
    site: 'https://rasiel.thunderblaze.tech',
    // base: '/Rasiel/',
    base: '/',
    trailingSlash: 'never',
    output: 'static',
});
