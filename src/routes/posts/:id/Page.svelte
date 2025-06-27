<script lang="ts">
  import type { PostWithContent } from '#/schema/post';
  import { fetchPostBySlug } from '@/api';
  import { markdownToHtml } from '@/markdown';
  import Flex from '/src/components/flex/Flex.svelte';
  import MotherboardBackground from '/src/components/backgrounds/MotherboardBackground.svelte';

  let { id }: { id?: string } = $props();
  let post = $state<PostWithContent | undefined>(undefined);
  $effect(() => {
    if (!id) {
      console.error('No id passed.');
      return;
    }
    fetchPostBySlug(id).then((fetchedPost) => (post = fetchedPost));
  });
</script>

<MotherboardBackground>
  <div class="post-container">
    <div class="card-background fill-background">
      {#if post}
        <Flex alignment="center">
          <h1 class="title">{post.title}</h1>
        </Flex>
        <Flex alignment="center">
          <h2 class="posted-date">
            {new Date(post.posted_date).toLocaleDateString()}
          </h2>
        </Flex>
        <article>
          {@html markdownToHtml(post.content)}
        </article>
      {:else}
        <Flex alignment="center">
          <div class="loader"></div>
        </Flex>
      {/if}
    </div>
  </div>
</MotherboardBackground>
