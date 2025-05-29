import { readable } from 'svelte/store';
import data from '../data/wallpapers.json';
import tagdata from '../data/tags.json';

export const wallpapers = readable(data);
export const tags = readable(tagdata);

export type Wallpaper = {
    title: string;
    thumbnail: string;
    tags: string[];
};
