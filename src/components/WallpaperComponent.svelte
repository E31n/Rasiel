<script lang="ts">
  import WallpaperCard from "./WallpaperCard.svelte";
  import SkeletonCard from "./SkeletonCard.svelte"; // 🔧 You’ll create this
  import { Pagination } from "bits-ui";
  import CaretLeft from "phosphor-svelte/lib/CaretLeft";
  import CaretRight from "phosphor-svelte/lib/CaretRight";

  type Wallpaper = {
    title: string;
    thumbnail: string;
    tags: string[];
  };

  import rawData from "../data/wallpapers.json";
  const wallpaperData: Wallpaper[] = rawData as Wallpaper[];

  let currentPage = 1;
  const perPage = 2;
  let pagedWallpapers: Wallpaper[] = [];
  let loading = true;

  async function loadWallpapers(page: number) {
    loading = true;
    // Simulate a fetch delay
    await new Promise((res) => setTimeout(res, 500));
    pagedWallpapers = wallpaperData.slice((page - 1) * perPage, page * perPage);
    loading = false;
  }

  $: loadWallpapers(currentPage); // Auto-run when currentPage changes
</script>

<main class="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
  {#if loading}
    {#each Array(perPage) as _}
      <SkeletonCard />
    {/each}
  {:else}
    {#each pagedWallpapers as wallpaper (wallpaper.title)}
      <WallpaperCard
        title={wallpaper.title}
        thumbnail={wallpaper.thumbnail}
        tags={wallpaper.tags}
      />
    {/each}
  {/if}
</main>

<!-- Bits UI Pagination -->
<Pagination.Root
  count={wallpaperData.length}
  perPage={perPage}
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
          {#if page.type === "ellipsis"}
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
      Showing {range.start} - {range.end} of {wallpaperData.length}
    </p>
  {/snippet}
</Pagination.Root>
