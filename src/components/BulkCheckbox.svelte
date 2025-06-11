	
<script lang="ts">
	import { Checkbox, useId, type WithoutChildrenOrChild } from "bits-ui";
    import { Check } from "phosphor-svelte";
 
	let {
		id = useId(),
		checked = $bindable(false),
		ref = $bindable(null),
		...restProps
	}: WithoutChildrenOrChild<Checkbox.RootProps> & {} = $props();
</script>
 
<Checkbox.Root bind:checked bind:ref {...restProps}
    class="border-muted bg-foreground data-[state=unchecked]:border-border-input data-[state=unchecked]:bg-background data-[state=unchecked]:hover:border-dark-40 peer inline-flex size-[25px] items-center justify-center rounded-md border transition-all duration-150 ease-in-out active:scale-[0.98] absolute top-2 left-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-background focus-visible:ring-offset-2 focus-visible:ring-foreground"
    id="terms"
    aria-labelledby="terms-label"
    name="terms"
>
	{#snippet children({ checked })}
		<div class="text-background inline-flex items-center justify-center">
            {#if checked}
                <Check class="size-[15px]" weight="bold" />
            {/if}
        </div>
	{/snippet}
</Checkbox.Root>
