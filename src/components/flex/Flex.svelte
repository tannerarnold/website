<script lang="ts">
  import { cx } from '@/class-merge';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Spacing = 'left' | 'center' | 'right' | 'apart';
  type Direction = 'row' | 'column';
  let {
    children,
    direction = 'row',
    alignment = 'left',
    ...options
  }: HTMLAttributes<HTMLDivElement> & {
    children: Snippet | null;
    direction: Direction;
    alignment: Spacing;
  } = $props();
</script>

<div
  {...options}
  class={cx(`flex-${direction}`, `flex-${alignment}`, options.class as string)}
>
  {@render children?.()}
</div>
