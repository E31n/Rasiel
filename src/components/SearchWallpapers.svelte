<script lang="ts">
    import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
    import { onMount } from 'svelte';
    import {
        tags,
        filteredWallpapers,
        wallpapers,
        type Wallpaper,
    } from './WallpaperStore.js';
    import {
        createContentIndex,
        searchContentIndex,
    } from '../utils/search-tags.js';
    import {
        CaretDown,
        Desktop,
        DeviceMobile,
        DiamondsFour,
        Repeat,
    } from 'phosphor-svelte';

    let searchInputRef: HTMLInputElement | null = null;

    let searchState = $state('loading');
    let searchQuery = $state('');
    let debounceTimeout: NodeJS.Timeout | null = null;

    onMount(async () => {
        createContentIndex($tags);
        searchState = 'ready';
    });

    $effect(() => {
        if (searchState !== 'ready') return;
        
        if (searchQuery.trim() === '') {
            filteredWallpapers.set(
                selectedCategory === 'All' 
                ? $wallpapers
                : $wallpapers.filter((w) => w.tags.includes(selectedCategory.toLowerCase()))
            );
            return;
        }

        if (debounceTimeout) clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
            const results = searchContentIndex(searchQuery);
            const filtered = new Set<Wallpaper>();

            for (const result of results) {
                $wallpapers
                    .filter((w) => w.tags.includes(result) && (selectedCategory === 'All' || w.tags.includes(selectedCategory.toLowerCase())))
                    .forEach((w) => filtered.add(w));
            }

            filteredWallpapers.set(Array.from(filtered));
        }, 500);
    });

    let dialogOpen = $state(false);
    let selectedCategory = $state('All');

    function selectOption(value: string) {
        selectedCategory = value;
    }

    // Optional: close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const trigger = document.getElementById('custom-select-trigger');
        if (!trigger?.contains(e.target as Node)) {
            dialogOpen = false;
        }
    });
</script>

<svelte:document
    onkeydown={(e) => {
        if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            searchInputRef?.focus();
        }
    }}
/>

<div
    class="flex sm:flex-row flex-col items-center justify-center w-full py-8 pb-5 gap-4 px-5"
>
    <div
        class="bg-muted text-muted-foreground ring-offset-background hover:bg-dark-10 focus-within:ring-foreground focus-within:ring-offset-background focus-visible:outline-none relative h-14 items-center justify-between gap-4 whitespace-nowrap rounded-xl px-5 text-base font-semibold transition-all duration-200 ease-in-out focus-within:ring-2 focus-within:ring-offset-2 shadow-md hover:shadow-lg inline-flex md:w-120 sm:w-88 w-full"
    >
        <div class="flex items-center gap-3 w-full">
            <MagnifyingGlass class="size-6 text-foreground/80" />
            <input
                bind:this={searchInputRef}
                bind:value={searchQuery}
                type="text"
                placeholder="Search Wallpapers ..."
                class="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-semibold text-base"
            />
        </div>
        <span class="flex items-center gap-[6px]">
            <kbd
                class="bg-background-alt dark:bg-dark-10 pointer-events-none h-6 select-none items-center gap-1 rounded-md border border-border px-1.5 font-mono text-md font-light opacity-100 sm:flex dark:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.07)]"
            >
                ⌘
            </kbd>
            <kbd
                class="bg-background-alt dark:bg-dark-10 pointer-events-none h-6 select-none items-center gap-1 rounded-md border border-border px-2 font-mono text-md font-light opacity-100 sm:flex dark:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.07)]"
            >
                F
            </kbd>
        </span>
    </div>

    <div class="relative w-full sm:w-52">
        <button
            id="custom-select-trigger"
            type="button"
            class="bg-muted text-muted-foreground ring-offset-background hover:bg-dark-10 focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus-visible:outline-none flex h-14 w-full items-center justify-between gap-4 whitespace-nowrap rounded-xl px-4 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
            onclick={() => (dialogOpen = !dialogOpen)}
        >
            <span class="text-foreground flex items-center gap-3">
                <DiamondsFour size={20} />
                <span id="selected-option">{selectedCategory}</span>
            </span>
            <CaretDown class="size-5 text-foreground/80" />
        </button>

        <!-- Dropdown -->
        {#if dialogOpen}
            <div
                class="flex absolute z-10 mt-2 w-full bg-muted text-foregound/87 border border-border rounded-xl shadow-lg flex-col items-start p-1.5 overflow-hidden"
            >
                <button
                    class="p-3 cursor-pointer flex w-full hover:bg-foreground/20 transition-colors items-center gap-3 rounded-md"
                    onclick={() => selectOption('Desktop')}
                >
                    <Desktop /> Desktop
                </button>
                <button
                    class="p-3 cursor-pointer flex w-full hover:bg-foreground/30 transition-colors items-center gap-3 rounded-md"
                    onclick={() => selectOption('Mobile')}
                >
                    <DeviceMobile /> Mobile
                </button>
                <button
                    class="p-3 cursor-pointer flex w-full hover:bg-foreground/30 transition-colors items-center gap-3 rounded-md"
                    onclick={() => selectOption('All')}
                >
                    <Repeat /> All
                </button>
            </div>
        {/if}
    </div>
</div>

<div>
    <!-- {#each results as result}
        {#each  as wallpaper}
        {/each}
    {/each} -->
</div>
