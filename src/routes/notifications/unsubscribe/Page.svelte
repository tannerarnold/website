<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements';
  import MotherboardBackground from '/src/components/backgrounds/MotherboardBackground.svelte';
  import Flex from '/src/components/flex/Flex.svelte';
  import { unsubscribe } from '@/api';
  import Card from '/src/components/card/Card.svelte';

  let unsubscribeState: boolean | undefined = $state(undefined);
  let email: string = $state('');
  let unsubscribeReason: string = $state('');

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    unsubscribeState = await unsubscribe(email, unsubscribeReason);
    if (unsubscribeState) email = unsubscribeReason = '';
  };
</script>

<MotherboardBackground>
  <div class="unsubscribe-container">
    <div class="card-background fill-background">
      <Flex alignment="center">
        <h1>Unsubscribe From Emails</h1>
      </Flex>
      {#if unsubscribeState === undefined}{:else if unsubscribeState === true}
        <Card type="hollow">
          <Flex alignment="center">
            <h3>Unsubscribed Successfully.</h3>
          </Flex>
        </Card>
      {:else}
        <Flex alignment="center">
          <h3>
            Something went wrong. Please try again, or contact Tanner via email.
          </h3>
        </Flex>
      {/if}
      <p>
        I'm sorry to see you go. Please enter your email and, optionally, enter
        your reason for unsubscribing below, and I'll keep in mind your
        feedback.
      </p>
      <p>You can resubscribe at any time.</p>
      <form name="feedback-form" onsubmit={submitHandler}>
        <input
          class="email-input"
          type="email"
          required
          id="email"
          name="email"
          bind:value={email}
          data-value={email}
        />
        <label class="email-label" for="email">Email</label>
        <input
          class="unsubscribe-reason-input"
          type="text"
          name="unsubscribe-reason"
          id="unsubscribe-reason"
          bind:value={unsubscribeReason}
          data-value={unsubscribeReason}
        />
        <label class="unsubscribe-reason-label" for="unsubscribe-reason"
          >Reason for unsubscribing?</label
        >
        <button type="submit">Unsubscribe</button>
      </form>
    </div>
  </div>
</MotherboardBackground>
