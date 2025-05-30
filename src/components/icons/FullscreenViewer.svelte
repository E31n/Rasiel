<script>
    import { Button } from 'bits-ui';
    import { CornersOut, X, Download } from 'phosphor-svelte';
    import { portal } from 'svelte-portal';
    import { scale } from 'svelte/transition';
    import { onMount } from 'svelte';

    export let imgUrl;
    export let thumbUrl;
    export let closeViewer;

    let modalRef;

    onMount(() => {
        // Ensure the modal is focused when opened
        modalRef?.focus();
        setTimeout(() => {
            modalRef?.requestFullscreen?.();
        }, 300);
        console.log('Fullscreen viewer loaded');
    });
</script>

<div
    use:portal={'body'}
    bind:this={modalRef}
    class="fixed inset-0 z-50 bg-black transition-opacity bg-opacity-80 flex items-center justify-center"
    on:click={closeViewer}
    on:keydown={closeViewer}
    role="dialog"
    tabindex="-1"
    in:scale={{ opacity: 0, duration: 300 }}
>
    <!-- in:fade -->
    <!-- Image -->
    <img
        src={imgUrl}
        alt="Fullscreen Preview"
        class="max-w-full max-h-full object-contain"
        style="cursor: zoom-out"
    />

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
</div>
