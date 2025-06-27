<script lang="ts">
  import MotherboardBackground from '/src/components/backgrounds/MotherboardBackground.svelte';
  import Flex from '/src/components/flex/Flex.svelte';
</script>

<MotherboardBackground>
  <div class="about-container">
    <div class="card-background fill-background">
      <Flex alignment="center">
        <h1>About</h1>
      </Flex>

      <br />

      <Flex alignment="center">
        <img
          width="400px"
          height="400px"
          class="portrait"
          src="/Tanner-Small.webp"
          alt="young man"
        />
      </Flex>

      <br />

      <article>
        <p>
          Tanner is an ambitious software developer based out of the Edmonton
          region in Alberta, Canada. With several years under his belt in
          software development, software QA, and IT / database administration,
          he brings a unique perspective and seasoned experience to any team he
          joins. Tanner's professional experience in C#, Typescript, and SQL
          have been demonstrated throughout his career across several projects.
        </p>
        <p>
          Tanner is fully self-taught, having began his journey when he was
          young. Diagnosed at sixteen with high functioning autism, his skills
          shine brightest when he is at a keyboard, typing code. His ability to
          recognize patterns, focus on a task, or dig deep during debugging are
          second to none. He's continually excited to talk code or one of his
          many passions.
        </p>
        <p>
          When Tanner is not typing away at his keyboard creating websites,
          apps, or configuring some of his many Linux machines, he enjoys
          playing video games, playing Dungeons and Dragons or Magic the
          Gathering with friends, competitively solving rubiks cubes, or singing
          and acting vicariously in a local choir and musical theatre troupe.
        </p>
      </article>

      <Flex alignment="center">
        <h1>About The Site</h1>
      </Flex>

      <br />

      <article>
        <p>
          This website was created by Tanner from scratch with love using some
          of his favourite technologies. It's a passion project he has spent
          many hours completing, and hopes you like it.
        </p>
        <p>
          For the frontend, his frameworks and libraries of choice include, but
          are not limited to:
        </p>
        <ul>
          <li>
            <strong>HTML</strong> - Because how could you make a website without
            HTML?
          </li>
          <li>
            <strong><a href="https://svelte.dev/">Svelte 5</a></strong> - For reuseable
            components (cards, navigation bar), reactivity (how does the button make
            the search bar expand? Or how does the website update when a new post
            is available?), and amazing speed thanks to its built in compiler.
          </li>
          <li>
            <strong><a href="https://sass-lang.com/">SCSS</a></strong> - An amazing
            language for creating amazing CSS (try making the search label hide on
            valid info using only CSS by hand!)
          </li>
          <ul>
            <li>
              The styles and colors seen here were created entirely by hand.
            </li>
          </ul>
          <li>
            <strong
              ><a href="https://www.typescriptlang.org/">Typescript</a></strong
            > - Javascript wouldn't be the same without type suggestions and compile-time
            error catching.
          </li>
        </ul>
        <p>
          For the backend (yes, there is a backend out there), he used the
          following frameworks and libraries:
        </p>
        <ul>
          <li>
            <strong
              ><a href="https://www.typescriptlang.org/">Typescript</a></strong
            > - It returns, doing great work on the backend as well. It's probably
            one of his most comfortable languages, and why he was able to make this
            website so quickly.
          </li>
          <li>
            <strong><a href="https://expressjs.com/">ExpressJS</a></strong> - A REST
            api server which was quick to set up, and even quicker to prototype.
          </li>
          <li>
            <strong><a href="https://orm.drizzle.team/">Drizzle ORM</a></strong>
            - A wonderful library for interfacing with a database using Typescript.
            The query builder is an incredible pleasure to use.
          </li>
          <li>
            <strong><a href="https://www.sqlite.org/">SQLite</a></strong> - A lightweight,
            yet full-featured single-file database that can be queried using SQL.
            It's more than enough for this project.
          </li>
          <li>
            <strong
              ><a href="https://github.com/paulmillr/chokidar">Chokidar</a
              ></strong
            > - The basis for storing posts and reading them back. He wanted to highlight
            this library, as it made it incredibly easy to set up the post system.
          </li>
        </ul>
        <p>
          And, to round it all off, here are some of the build and quality
          assurance tools he used to make the code a pleasure to work in:
        </p>
        <ul>
          <li>
            <strong
              ><a href="https://rollupjs.org/">Rollup</a> &
              <a href="https://vite.dev/">Vite</a></strong
            > - Build tools that compile Svelte, Sass, and Typescript into HTML,
            CSS, and Javascript. Without these, the project would have taken a whole
            lot longer and not have been such a joy to work in.
          </li>
          <li>
            <strong><a href="https://prettier.io/">Prettier</a></strong> - Code formatter
            which keeps the code and subsequent documents in the code base clean,
            consistent, and readable.
          </li>
          <li>
            <strong><a href="https://www.docker.com/">Docker</a></strong> - Containerization
            tool which hosts all the code and the backend in the cloud. Having a
            container is an absolute godsend for any project, and makes it a whole
            lot easier to deploy.
          </li>
        </ul>
        <p>
          You can find all the code for this website linked below. It's licensed
          under the Mozilla Public License 2.0.
        </p>
        <p>
          <a href="https://github.com/tannerarnold/website"
            >https://github.com/tannerarnold/website</a
          >
        </p>
      </article>
    </div>
  </div>
</MotherboardBackground>
