import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'mode';

// We initialize with a default value (e.g. "light") during SSR
const mode = writable<'light' | 'dark'>('dark');

function initMode() {
    console.log('Initializing mode store...');

    if (typeof window === 'undefined') return; // SSR guard

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
    ).matches;
    const initialMode =
        saved === 'light' || saved === 'dark'
            ? saved
            : systemPrefersDark
              ? 'dark'
              : 'light';

    mode.set(initialMode);
    applyMode(initialMode);
}

function applyMode(mode: 'light' | 'dark') {
    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', mode === 'dark');
        localStorage.setItem(LOCAL_STORAGE_KEY, mode);
    }
}

function toggleMode() {
    mode.update((prev) => {
        const next = prev === 'light' ? 'dark' : 'light';
        applyMode(next);
        return next;
    });
}

// Call init on the client only
// if (typeof window !== "undefined") {
initMode();
// }

export { mode, toggleMode };
