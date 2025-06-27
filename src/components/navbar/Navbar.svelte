<script lang="ts">
  import type { PostIndex } from '#/schema/post';
  import { isIndexReady, searchIndex } from '@/search.svelte';
  import Link from '../router/Link.svelte';
  import CardGrid from '../card/CardGrid.svelte';
  import Card from '../card/Card.svelte';
  import Database from '../icons/Database.svelte';
  import { cx } from '@/class-merge';
  import Flex from '../flex/Flex.svelte';
  import MagnifyingGlass from '../icons/MagnifyingGlass.svelte';
  let term = $state<string>('');
  let foundPosts = $state<
    Array<Pick<PostIndex, 'title' | 'slug'> & { matchedText: string }>
  >([]);
  let searchToggled = $state<boolean>(false);

  const searchPopoverClickHandler = (e: MouseEvent) => {
    e.preventDefault();
    document.getElementById('popover')!.remove();
    term = '';
    document.getElementById('search-bar')!.focus();
  };

  const searchBarKeyboardHandler = (e: KeyboardEvent) => {
    const alphaNumericKeys = new RegExp(/[A-Za-z0-9 \-"'\(\)\/?.]/);
    if (!e.key.match(alphaNumericKeys)) e.preventDefault();
  };

  const searchPopoverKeyboardHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && document.getElementById('popover') !== null) {
      e.preventDefault();
      document.getElementById('popover')!.remove();
      term = '';
      document.getElementById('search-bar')!.focus();
    }
  };

  window.onkeydown = searchPopoverKeyboardHandler;

  $effect(() => {
    if (!term || !isIndexReady()) return;
    if (term) {
      foundPosts = searchIndex(term);
    }
  });
</script>

<nav>
  <div class="link-container">
    <Link as="a" to="/">Home</Link>
    <Link as="a" to="/about">About</Link>
    <Link as="a" to="/posts">Blog</Link>
    <Link as="a" to="/contact">Contact</Link>
  </div>
  <div class="search-container">
    <div class={cx('search-area', searchToggled ? 'active' : '')}>
      <div class="search">
        <div class="search-bar">
          <input
            id="search-bar"
            class="search-bar-input"
            type="search"
            autocomplete="off"
            spellcheck="false"
            onkeypress={searchBarKeyboardHandler}
            bind:value={term}
            disabled={!isIndexReady()}
            data-value={term}
          />
          <label class={cx(searchToggled ? 'active' : '')} for="search-bar"
            >{!isIndexReady() ? 'Creating Search Index' : 'Search'}</label
          >
          <div class="search-bar-line"></div>
        </div>
        {#if !isIndexReady()}
          <div class={cx('loader', searchToggled ? 'active' : '')}></div>
        {/if}
      </div>
    </div>
    <button
      class="icon-button"
      onclick={() => (searchToggled = !searchToggled)}
    >
      <MagnifyingGlass />
    </button>
  </div>
</nav>
{#if term && foundPosts.length > 0}
  <div id="popover">
    <div
      class="popover-underlay"
      role="button"
      tabindex="0"
      onclick={searchPopoverClickHandler}
      onkeydown={searchPopoverKeyboardHandler}
    ></div>
    <div class="popover-content">
      <div class="search">
        <div class="search-bar">
          <input
            id="popover-search-bar"
            class="search-bar-input"
            type="search"
            autocomplete="off"
            spellcheck="false"
            bind:value={term}
            disabled={!isIndexReady()}
            data-value={term}
          />
          <label for="popover-search-bar">Search</label>
          <div class="search-bar-line"></div>
        </div>
        {#if !isIndexReady()}
          <div class={cx('loader', searchToggled ? 'active' : '')}></div>
        {/if}
      </div>
      <CardGrid style="width: 100%; padding: 1rem 0;" columns={1}>
        {#each foundPosts as post}
          <Card>
            <div>
              <Link as="h2" to={`/posts/${post.slug}`}>{@html post.title}</Link>
              <p>{@html post.matchedText}</p>
            </div>
          </Card>
        {/each}
      </CardGrid>
    </div>
  </div>
{/if}
