<script lang="ts">
  import { numClassesChart, accuracyChart } from '$lib/marcelle';
  import { logEvent } from '$lib/marcelle/log';
  import ScoreBoard from '$lib/ScoreBoard.svelte';
  import { marcelle } from '$lib/utils';
  import WelcomeCard from '$lib/WelcomeCard.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    logEvent('navigate', 'dashboard');
  });
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  <div class="marcelle flex gap-2">
    <div class="flex flex-col items-stretch">
      <WelcomeCard />
      <ScoreBoard />
    </div>

    <div class="grow">
      <div class="card" use:marcelle={accuracyChart} />
      <div class="card" use:marcelle={numClassesChart} />
    </div>
  </div>
</section>

<style>
  section {
    width: 100%;
    flex: 1;
  }
</style>
