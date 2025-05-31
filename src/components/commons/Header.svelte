<script lang="ts">
    import { Button } from 'bits-ui';
    import Search from '../SearchTags.svelte';
    import { Logo } from '../../icons/index.js';
    import LightSwitch from './LightSwitch.svelte';
    import { siteConfig } from '../../config/index.js';
    import Github from '../../icons/github.svelte';
</script>

<header
    class="border-border bg-background/75 sticky top-0 z-50 overflow-x-hidden border-b backdrop-blur-md"
>
    <div class="px-4">
        <div class="flex h-[70px] items-center justify-between gap-3">
            <div class="flex w-full items-center gap-1.5 md:w-auto">
                <!-- <MobileNav /> -->

                <a
                    href="{import.meta.env.BASE_URL}"
                    class="focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden ml-2 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 md:mr-[125px]"
                >
                    <Logo />
                </a>

                <Search />
            </div>
            <div class="flex items-center justify-end">
                <Button.Root
                    href={siteConfig.links?.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Light Switch"
                    class="rounded-input hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden relative inline-flex h-10 w-10 items-center justify-center px-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                    <Github class="size-5" />
                </Button.Root>
                <LightSwitch />
            </div>
        </div>
    </div>
</header>
