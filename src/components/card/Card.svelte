<script lang="ts">
  import { cx } from '@utils/class-merge';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    children,
    ...options
  }: HTMLAttributes<HTMLDivElement> & { children: Snippet | null } = $props();
</script>

<div {...options} class={cx('card', options.class as string | undefined)}>
  {@render children?.()}
</div>
