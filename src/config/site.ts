import { defineSiteConfig } from '../utils/use-site-config.svelte.js';

export const siteConfig = defineSiteConfig({
    name: 'Raziel',
    url: 'https://e31n.github.io/Rasiel/',
    description:
        'A High-quality Wallpaper library that allows Previewing and Bulk Downloading with a focus on user experience and accessibility.',
    ogImage: {
        url: 'https://e31n.github.io/Rasiel/og.png',
        height: '630',
        width: '1200',
    },
    author: 'Huntabyte',
    license: {
        name: 'MIT',
        url: 'https://github.com/huntabyte/bits-ui/blob/main/LICENSE',
    },
    links: {
        github: 'https://github.com/E31n/Rasiel',
    },
    keywords: [
        'raziel',
        'e31n',
        'wallpaper',
        'high-quality',
        'library',
        'user experience',
        'accessibility',
        'open source',
        'free',
    ],
});

export type SiteConfig = typeof siteConfig;
