<script lang="ts">
    import { scale } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { AspectRatio, Button } from 'bits-ui';
    import SkeletonCard from './SkeletonCard.svelte';
    import { CornersOut, Download } from 'phosphor-svelte';
    import FullscreenViewer from './FullscreenViewer.svelte';

    export let title: string;
    export let image: string;
    export let thumbnail: string;
    export let tags: string[] = [];
    export let idx: number;

    let isViewerOpen = false;
    let isLoading = true;

    const openViewer = () => {
        isViewerOpen = true;
    };

    const closeViewer = () => {
        isViewerOpen = false;
    };

    onMount(() => {
        // Simulate loading delay
        setTimeout(() => {
            isLoading = false;
        }, 50);
    });
</script>

{#if isLoading}
    <SkeletonCard />
{:else}
    <div
        class="rounded-xl shadow-lg hover:shadow-xl p-3 transition-all bg-white dark:bg-zinc-800 overflow-hidden"
        in:scale={{ duration: 200 }}
        out:scale={{ duration: 0 }}
    >
        <AspectRatio.Root
            ratio={16 / 9}
            class="rounded-md w-full bg-transparent group relative overflow-hidden"
        >
            <img
                src={`${import.meta.env.BASE_URL}/${thumbnail}`}
                class="h-full w-full rounded-md object-cover group-hover:scale-110 transition-transform"
                alt={title}
                loading="eager"
            />
            <div
                class="absolute inset-0 bg-background/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none grid place-items-center"
                aria-hidden="true"
            >
                <CornersOut
                    class="text-4xl bg-foreground/50 rounded-xl text-background p-1.5 backdrop-blur-md cursor-pointer pointer-events-auto hover:rotate-45 transition-transform"
                    onclick={openViewer}
                    onkeydown={closeViewer}
                />
                {#if isViewerOpen}
                    <FullscreenViewer {idx} {closeViewer} />
                {/if}
            </div>
            <Button.Root
                class="font-xl bg-foreground/60 text-background p-2 rounded-sm hover:bg-foreground/90 transition-colors cursor-pointer flex absolute bottom-2 right-2 backdrop-blur-md"
                href={`/${image}`}
                download={thumbnail
                    .slice(thumbnail.lastIndexOf('/') + 1)
                    .slice(0, -11) + image.slice(image.lastIndexOf('.'))}
            >
                <Download />
            </Button.Root>
        </AspectRatio.Root>
        <div class="p-0.5 pt-1">
            <!-- <h3 class="font-bold text-lg text-foreground">{title}</h3> -->
            <div class="mt-2 flex flex-wrap gap-2">
                {#each tags as tag}
                    <Button.Root
                        class="text-xs font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-100 px-2 py-0.5 pb-1 rounded-sm hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors cursor-pointer"
                        href={`/${tag}`}
                    >
                        {tag}
                    </Button.Root>
                {/each}
            </div>
        </div>
    </div>
{/if}
