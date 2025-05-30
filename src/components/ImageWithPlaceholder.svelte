<script lang="ts">
    import { fade } from 'svelte/transition';

    export let src: string;
    export let placeholderSrc: string;
    export let alt = '';
    export let className = '';
    export let style = '';
    export let onLoad: (() => void) | undefined;

    let imgSrc = placeholderSrc ?? src;

    $: if (src) {
        const img = new Image();
        img.onload = () => {
            imgSrc = src;
            onLoad?.();
        };
        img.src = src;
    }
</script>

<img {alt} src={imgSrc} class={className} {style} in:fade={{ duration: 300 }} />
