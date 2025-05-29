<script lang="ts">
    import { scale } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { AspectRatio, Button } from 'bits-ui';
    import SkeletonCard from './SkeletonCard.svelte';

    export let title: string;
    export let thumbnail: string;
    export let tags: string[] = [];

    let loading = true;

    // Trigger the animation after mount
    onMount(() => {
        loading = false;
    });
</script>

{#if loading}
    <SkeletonCard />
{:else}
    <div
        class="rounded-xl shadow-lg hover:shadow-xl p-3 transition-all bg-white dark:bg-zinc-800 overflow-hidden"
        in:scale={{ duration: 200 }}
        out:scale={{ duration: 0 }}
    >
        <AspectRatio.Root
            ratio={16 / 9}
            class="rounded-md w-full bg-transparent"
        >
            <img
                src={thumbnail}
                class="h-full w-full rounded-md object-cover"
                alt={title}
                loading="lazy"
            />
        </AspectRatio.Root>
        <div class="p-4">
            <h3 class="font-bold text-lg text-foreground">{title}</h3>

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
