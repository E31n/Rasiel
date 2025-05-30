import { writable } from 'svelte/store';

export function debounced(value: string, delay = 300) {
    const store = writable<string>(value);
    let timeout: NodeJS.Timeout;

    return {
        subscribe: store.subscribe,
        set(newValue: string) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                store.set(newValue);
            }, delay);
        },
    };
}
