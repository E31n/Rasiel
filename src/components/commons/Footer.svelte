<!-- src/components/Footer.svelte -->
<script lang="ts">
  import { siteConfig } from '../../config/site.ts';
</script>

<footer class="text-sm text-gray-500 text-center p-4">
  &copy; {new Date().getFullYear()} {siteConfig.name} · 
  <a href={siteConfig.links?.github} target="_blank" rel="noopener noreferrer">GitHub</a>
</footer>
