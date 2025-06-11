<script lang="ts">
  import JSZip from 'jszip';
  import { saveAs } from 'file-saver';
  import { get } from "svelte/store";
  import { filteredWallpapers } from "@/store/WallpaperStore";
    import { Button } from 'bits-ui';

  let downloadLinkArray: string[] = [];
  export let selectedWallpapers: number[];
  const wallpapers = get(filteredWallpapers);

  const DownloadAll = async () => {
        downloadLinkArray = []; // Reset the array for new downloads
      wallpapers.forEach(wallpaper => {
          downloadLinkArray.push(wallpaper.image);
      });
      downloadAll();
  };
  
  const DownloadSelected = async (selectedWallpapers: number[]) => {
        downloadLinkArray = []; // Reset the array for new downloads
      const selected = wallpapers.filter((_, index) => selectedWallpapers.includes(index));
      selected.forEach(wallpaper => {
          downloadLinkArray.push(wallpaper.image);
      });
        if (downloadLinkArray.length > 0) {
            downloadAll();
        } else {
            console.warn("No wallpapers selected for download.");
        }
  };

  let downloading = false;
  let progress = 0;

  async function downloadAll() {
    downloading = true;
    progress = 0;

    const zip = new JSZip();
    const folder = zip.folder("wallpapers");

    for (let i = 0; i < downloadLinkArray.length; i++) {
      const url = downloadLinkArray[i];
      const filename = url.split('/').pop() ?? `image${i + 1}.jpg`;

      try {
        const response = await fetch(url);
        const blob = await response.blob();
        folder?.file(filename, blob);
      } catch (err) {
        console.error(`Failed to download ${url}`, err);
      }

      progress = Math.round(((i + 1) / downloadLinkArray.length) * 100);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
      progress = Math.round(metadata.percent);
    });

    saveAs(zipBlob, "wallpapers.zip");

    downloading = false;
  }
</script>

<div class="flex items-center justify-center p-6 gap-4">
    <Button.Root
        class="h-input rounded-input bg-dark/75 text-background shadow-mini hover:bg-dark/50 focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex w-full items-center justify-center text-[15px] font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer"
        onclick={() => DownloadSelected(selectedWallpapers)} disabled={downloading}
    >
        Download Selected
    </Button.Root>
    <Button.Root
        class="h-input rounded-input bg-dark/75 text-background shadow-mini hover:bg-dark/50 focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex w-full items-center justify-center text-[15px] font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer"
        onclick={DownloadAll} disabled={downloading}
    >
        Download All
    </Button.Root>
</div>
<div>
    {#if downloading}
        <p class="text-center text-sm text-foreground/80">Downloading... {progress}%</p>
        <progress max="100" value={progress}></progress>
    {/if}
</div>

<style>
  progress {
    width: 100%;
    margin-top: 0.5rem;
  }
</style>
