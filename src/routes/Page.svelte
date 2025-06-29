<script lang="ts">
  import Flex from '/src/components/flex/Flex.svelte';
  import MotherboardBackground from '/src/components/backgrounds/MotherboardBackground.svelte';
  import Typescript from '/src/components/icons/Typescript.svelte';
  import Database from '/src/components/icons/Database.svelte';
  import Html5 from '/src/components/icons/HTML5.svelte';
  import Css3 from '/src/components/icons/CSS3.svelte';
  import CSharp from '/src/components/icons/CSharp.svelte';
  import Terminal from '/src/components/icons/Terminal.svelte';
  import Aws from '/src/components/icons/AWS.svelte';
  import Azure from '/src/components/icons/Azure.svelte';
  import Firewall from '/src/components/icons/Firewall.svelte';
  import { fetchPosts, subscribe } from '@/api';
  import type { PostIndex } from '#/schema/post';
  import Card from '/src/components/card/Card.svelte';
  import Link from '/src/components/router/Link.svelte';
  import Error from '/src/components/icons/Error.svelte';
  import Motherboard from '/src/components/icons/Motherboard.svelte';
  import Gears from '/src/components/icons/Gears.svelte';
  import Cloud from '/src/components/icons/Cloud.svelte';
  import type { FormEventHandler } from 'svelte/elements';
  //   const titleStrings = [
  //     'Typescript',
  //     'SQL',
  //     'C#',
  //     'Linux',
  //     'Self-Taught',
  //     'Resilient',
  //     'Unique',
  //     'IT Professional',

  let posts = $state<PostIndex[]>([]);
  let email = $state<string>('');

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await subscribe(email);
  };

  $effect(() => {
    fetchPosts({ order: 'date:desc', page: 0, size: 3 }).then(
      (list) => (posts = list),
    );
  });
</script>

<MotherboardBackground>
  <div class="name-title-container">
    <h1 class="name-title">Tanner Arnold</h1>
  </div>
  <div class="profession-container">
    <div class="card-background">
      <Flex class="profession-title" alignment="center">
        <h2>IT Professional</h2>
      </Flex>
      <Flex class="profession-subtitle" alignment="center">
        <h3>Software, Networking, Administration, Troubleshooting</h3>
      </Flex>
      <form id="subscribe-form" onsubmit={submitHandler}>
        <input
          id="subscribe-email"
          class="subscribe-input"
          type="email"
          required
          bind:value={email}
        />
        <label for="subscribe-email">Email</label>
        <button type="submit">Subscribe To The Blog</button>
      </form>
      <p class="subscribe-callout">
        Subscribe to the blog to receive email updates when I make a new post!
      </p>
    </div>
  </div>
  <div class="latest-post-and-archive-container">
    <div class="card-background">
      <Flex alignment="left">
        <h2>Latest Posts</h2>
      </Flex>
      <p class="latest-posts-and-archive-callout">
        You can find my latest posts here. Or, if you are looking for the
        archive of posts, click the link below the article cards.
      </p>
      <div class="latest-posts-list">
        {#if posts && posts.length > 0}
          {#each posts as post (post.id)}
            <Card type="filled">
              <Link as="h3" to={`/posts/${post.slug}`}>{post.title}</Link>
              <p>Posted {new Date(post.posted_date).toLocaleDateString()}</p>
            </Card>
          {/each}
        {:else}
          <p>Nothing to see here.</p>
        {/if}
      </div>
      <Flex alignment="center">
        <Link as="a" to="/posts">Post Archive</Link>
      </Flex>
    </div>
  </div>
  <div class="software-container">
    <div class="card-background">
      <Flex alignment="center">
        <h2>Software Development</h2>
      </Flex>
      <div class="icon-grid">
        <div class="icon-listing-pair">
          <Typescript />
          <h3>Typescript</h3>
        </div>
        <div class="icon-listing-pair">
          <Database />
          <h3>SQL</h3>
        </div>
        <div class="icon-listing-pair">
          <div>
            <Html5 />
            <Css3 />
          </div>
          <h3>HTML/CSS</h3>
        </div>
        <div class="icon-listing-pair">
          <CSharp />
          <h3>C#</h3>
        </div>
      </div>
    </div>
  </div>
  <div class="systems-administration-container">
    <div class="card-background">
      <Flex alignment="center">
        <h2>Systems Administration</h2>
      </Flex>
      <div class="icon-grid">
        <div class="icon-listing-pair">
          <Terminal />
          <h3>Linux</h3>
        </div>
        <div class="icon-listing-pair">
          <Database />
          <h3>Database</h3>
        </div>
        <div class="icon-listing-pair">
          <div>
            <Aws />
            <Azure />
          </div>
          <h3>Cloud</h3>
        </div>
        <div class="icon-listing-pair">
          <Firewall />
          <h3>Security</h3>
        </div>
      </div>
    </div>
  </div>
  <div class="it-support-container">
    <div class="card-background">
      <Flex alignment="center">
        <h2>IT Support</h2>
      </Flex>
      <div class="icon-grid">
        <div class="icon-listing-pair">
          <Error />
          <h3>Troubleshoot</h3>
        </div>
        <div class="icon-listing-pair">
          <Motherboard />
          <h3>Diagnose</h3>
        </div>
        <div class="icon-listing-pair">
          <Gears />
          <h3>Automation</h3>
        </div>
        <div class="icon-listing-pair">
          <Cloud />
          <h3>Networking</h3>
        </div>
      </div>
    </div>
  </div>
</MotherboardBackground>
<!-- <div class="background">
  <div class="background-overlay"></div>
</div>
<div class="background-2">
  <div class="background-overlay"></div>
</div>

<div class="content">
  <Flex alignment="apart">
    <Flex direction="column" style="width: 50%; height: 100%;">
      <Flex style="margin-top: 1rem; align-items: center" alignment="center">
        svelte-ignore a11y_missing_content
        <h2 style="height: 54.5px" id="title"></h2>
        <span class="cursor" style="font-size: 2rem">|</span>
      </Flex>
      <div style="height: 3rem"></div>
      <Flex style="margin-top: 1rem;" alignment="apart">
        <Link style="font-weight: bold" as="a" to="/about">About Me</Link>
        <Link style="font-weight: bold" as="a" to="/posts">Read My Blog</Link>
        <Link style="font-weight: bold" as="a" to="/contact">Contact</Link>
      </Flex>
    </Flex>
    <Flex
      alignment="center"
      style="width: 200px; height: 200px; align-items: center;"
    >
      <img
        width="180px"
        height="180px"
        src="/Tanner-Small.webp"
        alt="young man"
      />
    </Flex>
  </Flex>
</div>

<div style="height: 30vh"></div>

<div class="content">
  <CardGrid>
    <Card>
      <Flex>
        <h2 style="height: 54.5px" id="proficient">Proficient</h2>
      </Flex>
      <p>
        With several years of professional experience underneath his belt,
        Tanner brings strong foundations in coding and IT. He knows the
        foundation needed for an application and what it takes to scale.
      </p>
    </Card>
    <Card>
      <Flex>
        <h2 style="height: 54.5px" id="skilled">Skilled</h2>
      </Flex>
      <p>
        Tanner is fully self-taught in his experience, and brings a natural gift
        for learning new tech stacks with him. He hones his skills on the
        regular, and is a perfect addition to a cutting-edge project.
      </p>
    </Card>
    <Card>
      <Flex>
        <h2 style="height: 54.5px" id="passionate">Passionate</h2>
      </Flex>
      <p>
        Tanner brings a passion unlike any other to IT work and a team. He's
        constantly excited for the next project to take on, and will dig in to a
        project with uncanny determination.
      </p>
    </Card>
  </CardGrid>
</div> -->
