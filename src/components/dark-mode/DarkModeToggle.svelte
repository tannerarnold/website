<script lang="ts">
  import { getTheme, setTheme } from '@/dark-mode';
  import Moon from '../icons/Moon.svelte';
  import Sun from '../icons/Sun.svelte';
  let currentMode = $state<'light' | 'dark'>(getTheme());
  function toggleTheme() {
    if (currentMode === 'light') {
      currentMode = 'dark';
      setTheme('dark');
    } else {
      currentMode = 'light';
      setTheme('light');
    }
  }
</script>

<button class="icon-button" onclick={() => toggleTheme()}>
  {#if currentMode === 'light'}
    <Moon />
  {:else}
    <Sun />
  {/if}
</button>
