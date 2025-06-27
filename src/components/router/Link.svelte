<script lang="ts">
  import { cx } from '@/class-merge';
  import { navigate } from '@/routing.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type ImitateAs = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'a';

  let {
    to,
    as = 'a',
    children,
    ...options
  }: HTMLAttributes<HTMLAnchorElement> & {
    to: string;
    as?: ImitateAs;
    children: Snippet | null;
  } = $props();
</script>

<a
  {...options}
  class={cx('link', as, options.class as string)}
  href={to}
  use:navigate={{ to }}
>
  {@render children?.()}
</a>
