<script>
  import { base } from '$app/paths';
  import { logEvent } from '$lib/marcelle/log';

  import { onMount } from 'svelte';

  onMount(() => {
    logEvent('navigate', 'help');
  });
</script>

<svelte:head>
  <title>Help</title>
</svelte:head>

<div class="flex justify-center w-full">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video controls class="max-w-4xl w-full">
    <source src="{base}/tutorial.mp4" type="video/mp4" />
    Sorry, your browser doesn't support embedded videos.
  </video>
</div>

<style>
</style>
