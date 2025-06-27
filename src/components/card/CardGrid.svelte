<script lang="ts">
  import { cx } from '@/class-merge';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  let {
    children,
    columns = 2,
    ...options
  }: HTMLAttributes<HTMLDivElement> & {
    columns: number;
    children?: Snippet | null;
  } = $props();
</script>

<div
  {...options}
  style={cx(
    `grid-template-columns: ${columns > 1 ? `repeat(${columns}, 1fr)` : '100%'};`,
    options.style as string,
  )}
  class={cx('card-grid', options.class as string)}
>
  {#if children}
    {@render children?.()}
  {:else}
    <p>Nothing to show.</p>
  {/if}
</div>
