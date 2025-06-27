<script lang="ts">
  import MotherboardBackground from '/src/components/backgrounds/MotherboardBackground.svelte';
  import Flex from '/src/components/flex/Flex.svelte';
</script>

<MotherboardBackground>
  <div class="contact-container">
    <div class="card-background fill-background">
      <Flex alignment="center">
        <h1>Contact</h1>
      </Flex>
      <br />
      <p class="contact-callout">
        Tanner can be contacted for contracts, commissions, and job
        opportunities via the following:
      </p>
      <br />
      <Flex direction="column">
        <Flex alignment="center">
          <h2>Email</h2>
        </Flex>
        <Flex alignment="center">
          <a class="a" href="mailto:tanner.arnold.tech@gmail.com"
            >tanner.arnold.tech@gmail.com</a
          >
        </Flex>
      </Flex>
      <br />
      <Flex direction="column">
        <Flex alignment="center">
          <h2>LinkedIn</h2>
        </Flex>
        <Flex alignment="center">
          <a class="a" href="https://linkedin.com/in/arnoldt1"
            >linkedin.com/in/arnoldt1</a
          >
        </Flex>
      </Flex>
    </div>
  </div>
</MotherboardBackground>
