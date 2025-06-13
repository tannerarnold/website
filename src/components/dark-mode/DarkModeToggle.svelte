<script lang="ts">
  import { getTheme, setTheme } from '@utils/dark-mode';
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

<button onclick={toggleTheme}>
  {#if currentMode === 'light'}
    Toggle To Dark
  {:else}
    Toggle To Light
  {/if}
</button>
