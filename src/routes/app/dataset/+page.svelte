<script>
  import { selectClass, collectiveTrainingDataBrowser, newData } from '$lib/marcelle';
  import { logEvent } from '$lib/marcelle/log';
  import { marcelle } from '$lib/utils';
  import { onMount } from 'svelte';

  onMount(() => {
    localStorage.setItem('lastDataViewed', new Date(Date.now()).toISOString());
    newData.set(0);
    logEvent('navigate', 'dataset');
  });
</script>

<svelte:head>
  <title>Dataset</title>
</svelte:head>

<section class="marcelle">
  <div class="conf-row">
    <div class="card" use:marcelle={selectClass} />
  </div>
  <div class="conf-row">
    <div class="card" use:marcelle={collectiveTrainingDataBrowser} />
  </div>
</section>

<style>
  .conf-row {
    display: flex;
    width: 100%;
  }

  .card {
    flex-grow: 1;
  }
</style>
