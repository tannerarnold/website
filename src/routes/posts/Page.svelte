<script lang="ts">
  import Card from '/src/components/card/Card.svelte';
  import CardGrid from '/src/components/card/CardGrid.svelte';
  import { postIndex } from '@/search.svelte';
  import Link from '/src/components/router/Link.svelte';
  import Flex from '/src/components/flex/Flex.svelte';
  import MotherboardBackground from '/src/components/backgrounds/MotherboardBackground.svelte';
</script>

<MotherboardBackground>
  <div class="posts-index-container">
    <div class="card-background fill-background">
      <Flex alignment="center">
        <h1>Blog</h1>
      </Flex>
      <br />
      <p class="posts-index-description">
        General musings, work experiences, and anything learned which may help
        others end up here.
      </p>
      <br />
      {#if postIndex() && postIndex().length > 0}
        <CardGrid>
          {#each postIndex() as post (post.id)}
            <Card type="filled">
              <Link as="h2" to={`/posts/${post.slug}`}>{post.title}</Link>
              <p class="posted-date">
                Posted {new Date(post.posted_date).toLocaleDateString()}
              </p>
            </Card>
          {/each}
        </CardGrid>
      {:else}
        <Flex alignment="center">
          <p>Nothing to see here.</p>
        </Flex>
      {/if}
    </div>
  </div>
</MotherboardBackground>
