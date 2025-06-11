<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import { writable } from 'svelte/store';

    export let items: any[] = [];
    export let estimatedItemHeight: number = 40;
    export let height: number = 400;
    export let overscan: number = 5;

    let container: HTMLDivElement;
    import { get } from 'svelte/store';
    const scrollTop = writable(0);
    scrollTop.set(0);
    scrollTop.subscribe(value => $scrollTop = value);

    // Store measured heights and offsets
    let itemHeights: number[] = [];
    let itemOffsets: number[] = [];

    // Refs to item DOM nodes
    let itemRefs: Array<HTMLDivElement | null> = [];

    // Initialize heights and offsets
    $: {
        if (itemHeights.length !== items.length) {
            itemHeights = Array(items.length).fill(estimatedItemHeight);
        }
        itemOffsets = [];
        let offset = 0;
        for (let h of itemHeights) {
            itemOffsets.push(offset);
            offset += h;
        }
    }

    // Declare visible range variables
    let visibleStart = 0;
    let visibleEnd = items.length;

    // Find visible range based on scrollTop and offsets
    $: $scrollTop;
    $: {
        let start = 0;
        let end = items.length;
        // Find start index
        for (let i = 0; i < items.length; i++) {
            if (itemOffsets[i] + itemHeights[i] > $scrollTop) {
                start = Math.max(0, i - overscan);
                break;
            }
        }
        // Find end index
        for (let i = start; i < items.length; i++) {
            if (itemOffsets[i] > $scrollTop + height) {
                end = Math.min(items.length, i + overscan);
                break;
            }
        }
        visibleStart = start;
        visibleEnd = end;
        // Reset itemRefs to match the visible range
        itemRefs = new Array(visibleEnd - visibleStart).fill(null);
    }

    function handleScroll() {
        scrollTop.set(container.scrollTop);
    }

    // Measure item heights after render
    afterUpdate(() => {
        for (let i = visibleStart; i < visibleEnd; i++) {
            const ref = itemRefs[i - visibleStart];
            if (ref) {
                const h = ref.offsetHeight;
                if (h && h !== itemHeights[i]) {
                    itemHeights[i] = h;
                }
            }
        }
    });

    $: totalHeight = itemOffsets.length
        ? itemOffsets[itemOffsets.length - 1] + itemHeights[itemHeights.length - 1]
        : 0;

        
</script>

<div
    bind:this={container}
    style="overflow-y: auto; height: {height}px; position: relative;"
    on:scroll={handleScroll}
>
    <div style="height: {totalHeight}px; position: relative;">
        {#each items.slice(visibleStart, visibleEnd) as item, i (visibleStart + i)}
            <div
                bind:this={(el: HTMLElement) => itemRefs[i] = el}
                style="
                    position: absolute;
                    top: {itemOffsets[visibleStart + i]}px;
                    left: 0;
                    right: 0;
                <slot name=item item={item} index={visibleStart + i} />
                "
            >
                <slot name="item" {item} index={visibleStart + i} />
            </div>
        {/each}
    </div>
</div>
