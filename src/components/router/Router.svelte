<script lang="ts">
  import {
    loadRoute,
    getCurrentComponent,
    getCurrentComponentProps,
  } from '@/routing.svelte';
  $effect(() => {
    loadRoute(location.hash.replace(/^#?\/?/, ''));
  });
  // When navigating back, reload the old component
  window.onpopstate = () => loadRoute(location.hash.replace(/^#?\/?/, ''));
</script>

{#if getCurrentComponent()}
  {@const Component = getCurrentComponent()}
  {#if getCurrentComponentProps()}
    <Component {...getCurrentComponentProps()} />
  {:else}
    <Component />
  {/if}
{/if}
