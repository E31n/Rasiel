<script lang="ts">
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
    import { filteredWallpapers } from '../store/WallpaperStore';
    import type { Wallpaper, DownloadWallpaper } from '../store/WallpaperStore';
    import ImageWithPlaceholder from './commons/ImageWithPlaceholder.svelte';
    import DownloadButton from './DownloadButton.svelte';

    let { idx, closeViewer } = $props();

    let currIdx = $state(idx);

    let wallpaper: Wallpaper = $derived($filteredWallpapers[currIdx]);

    const imageType = $derived(
        wallpaper.image.slice(1 + wallpaper.image.lastIndexOf('.')),
    );

    const downloadWallpaper: DownloadWallpaper = $derived({
        Name: wallpaper.title,
        Link: `${import.meta.env.BASE_URL}${wallpaper.image}`,
        Thumbnail: `${import.meta.env.BASE_URL}${wallpaper.thumbnail}`,
        Size: wallpaper.size,
        Type: imageType,
    });

    let modalRef: HTMLDivElement | null = null;
    let slideshowInterval = $state<ReturnType<typeof setInterval> | null>(null);

    let changeIdx = (e: Event, direction: string) => {
        e.stopPropagation();
        if (direction === 'left') {
            currIdx =
                currIdx > 0 ? currIdx - 1 : $filteredWallpapers.length - 1;
        } else if (direction === 'right') {
            currIdx =
                currIdx < $filteredWallpapers.length - 1 ? currIdx + 1 : 0;
        }
    };

    let handleKeydown = (e: KeyboardEvent) => {
        e.stopPropagation();
        if (e.key === 'Escape') {
            closeViewer();
        } else if (e.key === 'ArrowLeft') {
            changeIdx(e, 'left');
        } else if (e.key === 'ArrowRight') {
            changeIdx(e, 'right');
        } else if (e.key === ' ') {
            toggleSlideshow(e);
        } else if (e.key === 'Tab') {
            const focusableElements = modalRef?.querySelectorAll(
                '[tabindex]:not([tabindex="-1"])',
            );
            const first = focusableElements?.[0];
            const last = focusableElements?.[focusableElements.length - 1];

            if (e.shiftKey) {
                // If Shift + Tab is pressed, focus the last element
                if (document.activeElement === first) {
                    e.preventDefault();
                    (last as HTMLElement)?.focus();
                }
            } else {
                // If Tab is pressed, focus the first element
                if (document.activeElement === last) {
                    e.preventDefault();
                    (first as HTMLElement)?.focus();
                }
            }
        }
    };

    let toggleSlideshow = (e: Event) => {
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
    {#key downloadWallpaper.Name}
        <ImageWithPlaceholder
            src={downloadWallpaper.Link}
            alt="Fullscreen Preview"
            className="w-screen h-screen object-cover"
            style="cursor: zoom-out"
            placeholderSrc={downloadWallpaper.Thumbnail}
        />
    {/key}

    <!-- Buttons -->
    <div class="absolute top-4 right-4 flex gap-3">
        <!-- Download Button -->
        <DownloadButton {downloadWallpaper}>
            <Button.Root
                class="font-xl bg-foreground/60 text-background p-2 px-2.5 rounded-sm hover:bg-foreground/90 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md"
                title="Download Image"
                tabindex={0}
            >
                <Download size={18} /> Download
            </Button.Root>
        </DownloadButton>

        <!-- Close Button -->
        <Button.Root
            title="Close Viewer"
            class="font-xl bg-foreground/60 text-background p-2 px-2.5 rounded-sm hover:bg-foreground/90 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md"
            onclick={closeViewer}
            tabindex={0}
        >
            <X size={20} />
        </Button.Root>
    </div>

    <!-- Left Caret Button -->
    <Button.Root
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-foreground/60 hover:bg-foreground/90 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] backdrop-blur-md p-3 py-7 rounded-lg cursor-pointer"
        onclick={(e: Event) => changeIdx(e, 'left')}
        tabindex={0}
    >
        <CaretLeft
            size={32}
            class="text-background hover:opacity-80 transition-opacity"
        />
    </Button.Root>

    <!-- Right Caret Button -->
    <Button.Root
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-foreground/60 hover:bg-foreground/90 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] backdrop-blur-md p-3 py-7 rounded-lg cursor-pointer"
        onclick={(e: Event) => changeIdx(e, 'right')}
        tabindex={0}
    >
        <CaretRight
            size={32}
            class="text-background hover:opacity-80 transition-opacity"
        />
    </Button.Root>

    <!-- SlideShow Button -->
    <Button.Root
        class="font-xl bg-foreground/60 text-background p-2 px-2.5 rounded-sm hover:bg-foreground/90 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md absolute bottom-4 right-4"
        title="Start Slideshow"
        onclick={toggleSlideshow}
        tabindex={0}
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
