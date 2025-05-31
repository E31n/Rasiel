	
<script lang="ts">
	import { AlertDialog, Button, type WithoutChild } from "bits-ui";
    import type { DownloadWallpaper } from "./WallpaperStore";

	type Props = AlertDialog.RootProps & {
		contentProps?: WithoutChild<AlertDialog.ContentProps>;
		downloadWallpaper: DownloadWallpaper;
        className?: string;
		// ...other component props if you wish to pass them
	};
 
	let {
		open = $bindable(false),
		children,
		contentProps,
		downloadWallpaper,
        className,
		...restProps
	}: Props = $props();
</script>
 
<AlertDialog.Root bind:open {...restProps}>
	<AlertDialog.Trigger class={className} onclick={(e) => e.stopPropagation()}>
		{@render children?.()}
	</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Overlay 
            class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
        />
		<AlertDialog.Content 
            {...contentProps}
            class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 border p-7 sm:max-w-lg md:w-full "
        >
            <div class="flex flex-col gap-4 pb-6">

                <AlertDialog.Title class="text-lg font-semibold tracking-tight">
                    Download The Image ?
                </AlertDialog.Title>
                <AlertDialog.Description class="flex flex-col text-foreground-alt text-sm">
                    <span>Name: {downloadWallpaper.Name}</span>
                    <span>Size: {downloadWallpaper.Size}</span>
                    <span>Type: {downloadWallpaper.Type}</span>
                </AlertDialog.Description>
            </div>
            <div class="flex w-full items-center justify-center gap-2">
                <AlertDialog.Cancel
                    class="h-input rounded-input bg-muted shadow-mini hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex w-full items-center justify-center text-[15px] font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                    Cancel
                </AlertDialog.Cancel>
                <AlertDialog.Action
                    class="flex w-full"
                >
                <Button.Root
                    href={downloadWallpaper.Link}
                    download={downloadWallpaper.Name}
                    class="h-input rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex w-full items-center justify-center text-[15px] font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
                    >
                        Download
                    </Button.Root>
                </AlertDialog.Action>
            </div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>

