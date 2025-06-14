<script lang="ts">
  import { cx } from '@utils/class-merge';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  let {
    children,
    ...options
  }: HTMLAttributes<HTMLDivElement> & { children?: Snippet | null } = $props();
</script>

<div {...options} class={cx('card-grid', options.class as string)}>
  {#if children}
    {@render children?.()}
  {:else}
    <p>Nothing to show.</p>
  {/if}
</div>
