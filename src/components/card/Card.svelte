<script lang="ts">
  import { cx } from '@utils/class-merge';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type CardType = 'hollow' | 'filled';

  let {
    children,
    type = 'hollow',
    ...options
  }: HTMLAttributes<HTMLDivElement> & {
    type?: CardType;
    children: Snippet | null;
  } = $props();
</script>

<div {...options} class={cx('card', type, options.class as string | undefined)}>
  {@render children?.()}
</div>
