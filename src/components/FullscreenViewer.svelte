<script>
    import { Button } from 'bits-ui';
    import {
        X,
        Download,
        CaretLeft,
        CaretRight,
        Play,
        Pause,
    } from 'phosphor-svelte';
    import { portal } from 'svelte-portal';
    import { scale } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { filteredWallpapers } from './WallpaperStore';
    import ImageWithPlaceholder from './ImageWithPlaceholder.svelte';

    let { idx, closeViewer } = $props();

    let currIdx = $state(idx);
    let imgUrl = $derived(`${import.meta.env.BASE_URL}/${$filteredWallpapers[currIdx].image}`);
    let thumbUrl = $derived(`${import.meta.env.BASE_URL}/${$filteredWallpapers[currIdx].thumbnail}`);

    let modalRef;
    let slideshowInterval = $state(null);

    let changeIdx = (e, direction) => {
        e.stopPropagation();
        if (direction === 'left') {
            currIdx =
                currIdx > 0 ? currIdx - 1 : $filteredWallpapers.length - 1;
        } else if (direction === 'right') {
            currIdx =
                currIdx < $filteredWallpapers.length - 1 ? currIdx + 1 : 0;
        }
    };

    let handleKeydown = (e) => {
        e.stopPropagation();
        if (e.key === 'Escape') {
            closeViewer();
        } else if (e.key === 'ArrowLeft') {
            changeIdx(e, 'left');
        } else if (e.key === 'ArrowRight') {
            changeIdx(e, 'right');
        } else if (e.key === ' ') {
            toggleSlideshow(e);
        }
    };

    let toggleSlideshow = (e) => {
        e.stopPropagation();
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        } else {
            slideshowInterval = setInterval(() => {
                changeIdx(e, 'right');
            }, 5000);
        }
    };

    onMount(() => {
        // Ensure the modal is focused when opened
        modalRef?.focus();
        setTimeout(() => {
            modalRef?.requestFullscreen?.();
        }, 300);
    });
</script>

<div
    use:portal={'body'}
    bind:this={modalRef}
    class="fixed inset-0 z-50 bg-black border-none transition-opacity bg-opacity-80 flex items-center justify-center"
    onclick={closeViewer}
    onkeydown={handleKeydown}
    role="dialog"
    tabindex="-1"
    in:scale={{ opacity: 0, duration: 300 }}
>
    <!-- Image -->
    {#key imgUrl}
        <ImageWithPlaceholder
            src={imgUrl}
            alt="Fullscreen Preview"
            className="w-screen h-screen object-cover"
            style="cursor: zoom-out"
            placeholderSrc={thumbUrl}
        />
    {/key}

    <!-- Buttons -->
    <div class="absolute top-4 right-4 flex gap-3">
        <!-- Download Button -->
        <Button.Root
            class="font-xl bg-foreground/60 text-background p-2 px-2.5 rounded-sm hover:bg-foreground/90 transition-colors cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md"
            href={`/${imgUrl}`}
            title="Download Image"
            download={thumbUrl
                .slice(thumbUrl.lastIndexOf('/') + 1)
                .slice(0, -11) + imgUrl.slice(imgUrl.lastIndexOf('.'))}
        >
            <Download size={18} /> Download
        </Button.Root>

        <!-- Close Button -->
        <Button.Root
            title="Close Viewer"
            class="font-xl bg-foreground/60 text-background p-2 px-2.5 rounded-sm hover:bg-foreground/90 transition-colors cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md"
            onclick|stopPropagation={closeViewer}
        >
            <X size={20} />
        </Button.Root>
    </div>

    <!-- Left Caret Button -->
    <Button.Root
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-foreground/60 hover:bg-foreground/90 transition-colors backdrop-blur-md p-3 py-7 rounded-lg cursor-pointer"
        onclick={(e) => changeIdx(e, 'left')}
    >
        <CaretLeft
            size={32}
            class="text-background hover:opacity-80 transition-opacity"
        />
    </Button.Root>

    <!-- Right Caret Button -->
    <Button.Root
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-foreground/60 hover:bg-foreground/90 transition-colors backdrop-blur-md p-3 py-7 rounded-lg cursor-pointer"
        onclick={(e) => changeIdx(e, 'right')}
    >
        <CaretRight
            size={32}
            class="text-background hover:opacity-80 transition-opacity"
        />
    </Button.Root>

    <!-- SlideShow Button -->
    <Button.Root
        class="font-xl bg-foreground/60 text-background p-2 px-2.5 rounded-sm hover:bg-foreground/90 transition-colors cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md absolute bottom-4 right-4"
        title="Start Slideshow"
        onclick={toggleSlideshow}
    >
        {#if slideshowInterval}
            <Pause size={20} />
        {:else}
            <Play size={20} />
        {/if}
        {#if slideshowInterval}
            Stop Slideshow
        {:else}
            Start Slideshow
        {/if}
    </Button.Root>
</div>
