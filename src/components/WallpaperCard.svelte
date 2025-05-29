<script lang="ts">
  import { AspectRatio } from "bits-ui";

  export let title: string;
  export let thumbnail: string;
  export let tags: string[] = [];
</script>

<div class="rounded-xl shadow-lg hover:shadow-xl p-3 transition-all bg-white dark:bg-zinc-800 overflow-hidden">
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
    <h3 class="font-semibold text-lg text-zinc-900 dark:text-white">{title}</h3>

    <div class="mt-2 flex flex-wrap gap-2">
      {#each tags as tag}
        <span
          class="text-xs font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-100 px-2 py-0.5 rounded-full"
          >{tag}</span
        >
      {/each}
    </div>
  </div>
</div>
