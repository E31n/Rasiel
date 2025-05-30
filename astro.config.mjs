// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';

const isProd = process.env.NODE_ENV === 'production';
console.log(`Running in ${isProd ? 'production' : 'development'} mode`);

// https://astro.build/config
export default defineConfig({
    integrations: [svelte()],
    vite: {
        plugins: [tailwindcss()],
    },
    site: isProd
        ? 'https://E13n.github.io/Raziel/'
        : 'http://localhost:4321',
    base: isProd ? '/Raziel/' : '/',

});
