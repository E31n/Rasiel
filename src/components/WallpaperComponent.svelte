<script lang="ts">
    let tag = $props<string | null>();

    import WallpaperCard from './WallpaperCard.svelte';
    import SkeletonCard from './SkeletonCard.svelte'; // 🔧 You’ll create this
    import { Pagination } from 'bits-ui';
    import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
    import CaretRight from 'phosphor-svelte/lib/CaretRight';
    import {
        wallpapers as wallpaperData,
        filteredWallpapers,
    } from '../components/WallpaperStore';
    import type { Wallpaper } from '../components/WallpaperStore';

    let currentPage = $state(1);
    const perPage = 9;
    let pagedWallpapers: Wallpaper[] = $state([]);
    let loading = $state(true);

    filteredWallpapers.set(
        tag.tag
            ? $wallpaperData.filter((wallpaper) =>
                  wallpaper.tags.includes(tag.tag),
              )
            : $wallpaperData,
    );

    async function loadWallpapers(page: number) {
        loading = true;
        pagedWallpapers = $filteredWallpapers.slice(
            (page - 1) * perPage,
            page * perPage,
        );
        loading = false;
    }

    $effect(() => {
        loadWallpapers(currentPage);
    });
</script>

<main
    class="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
>
    {#if loading}
        {#each Array(perPage) as _}
            <SkeletonCard />
        {/each}
    {:else}
        {#each pagedWallpapers as wallpaper, i (wallpaper.thumbnail)}
            <WallpaperCard
                title={wallpaper.title}
                image={wallpaper.image}
                thumbnail={wallpaper.thumbnail}
                tags={wallpaper.tags}
                idx={i + (currentPage - 1) * perPage}
            />
        {/each}
    {/if}
</main>

<!-- Bits UI Pagination -->
<Pagination.Root
    count={$filteredWallpapers.length}
    {perPage}
    bind:page={currentPage}
    onPageChange={(page: number) => {
        currentPage = page;
    }}
>
    {#snippet children({ pages, range })}
        <div class="my-8 flex items-center justify-center">
            <Pagination.PrevButton
                class="hover:bg-dark-10 disabled:text-muted-foreground mr-[25px] inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent active:scale-[0.98] disabled:cursor-not-allowed hover:disabled:bg-transparent"
            >
                <CaretLeft class="size-6" />
            </Pagination.PrevButton>

            <div class="flex items-center gap-2.5">
                {#each pages as page (page.key)}
                    {#if page.type === 'ellipsis'}
                        <div
                            class="text-foreground-alt select-none text-[15px] font-medium"
                        >
                            ...
                        </div>
                    {:else}
                        <Pagination.Page
                            {page}
                            class="hover:bg-dark-10 data-selected:bg-foreground data-selected:text-background inline-flex size-10 select-none items-center justify-center rounded-[9px] bg-transparent text-[15px] font-medium active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent"
                        >
                            {page.value}
                        </Pagination.Page>
                    {/if}
                {/each}
            </div>

            <Pagination.NextButton
                class="hover:bg-dark-10 disabled:text-muted-foreground ml-[29px] inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent active:scale-[0.98] disabled:cursor-not-allowed hover:disabled:bg-transparent"
            >
                <CaretRight class="size-6" />
            </Pagination.NextButton>
        </div>
        <p class="text-muted-foreground text-center text-[13px]">
            Showing {range.start} - {range.end} of {$filteredWallpapers.length}
        </p>
    {/snippet}
</Pagination.Root>
