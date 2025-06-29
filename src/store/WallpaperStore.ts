import { readable, writable } from 'svelte/store';
import data from '../data/wallpapers.json';
import tagdata from '../data/tags.json';

export type Wallpaper = {
    title: string;
    image: string;
    thumbnail: string;
    size: string;
    tags: string[];
};

export type DownloadWallpaper = {
    Name: string;
    Size: string;
    Type: string;
    Link: string;
    Thumbnail: string;
};

function shuffleArray(array: Wallpaper[]): Wallpaper[] {
    const shuffled = [...array]; // make a copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // swap
    }
    return shuffled;
}

const wallpapers = readable(shuffleArray(data));
const tags = readable(tagdata);
const filteredWallpapers = writable<Wallpaper[]>([]);

export { wallpapers, tags, filteredWallpapers };
