<script>
  import {
    confmatConfidences,
    confMatDatasetBrowser,
    confmatHasSelection,
    confmatImage,
    confSelection,
    cvConfusion,
  } from '$lib/marcelle';
  import { logEvent } from '$lib/marcelle/log';
  import { marcelle } from '$lib/utils';
  import { onMount } from 'svelte';

  onMount(() => {
    logEvent('navigate', 'inspect-errors');
  });
</script>

<svelte:head>
  <title>Inspect Errors</title>
</svelte:head>

<section class="marcelle">
  <div class="flex flex-col md:flex-row w-full md:items-stretch">
    <div
      class="tooltip tooltip-bottom tooltip-warning"
      style="z-index: 10;"
      data-tip="select each square to see true/false predictions"
    >
      <div class="card grow-0 max-w-full confmat" use:marcelle={cvConfusion} />
    </div>
    <div class="flex flex-col grow">
      <div class="stats shadow mt-2 mx-1">
        <div class="stat">
          <div class="stat-title">True Label</div>
          <div class="stat-value">{$confSelection?.y || ''}</div>
        </div>

        <div class="stat">
          <div class="stat-title">Predicted Label</div>
          <div
            class="stat-value"
            class:text-success={$confSelection?.x === $confSelection?.y}
            class:text-error={$confSelection?.x !== $confSelection?.y}
          >
            {$confSelection?.x || ''}
          </div>
        </div>
      </div>
      <div
        class="tooltip tooltip-bottom tooltip-warning"
        style="z-index: 10;"
        data-tip="select each instance to see confidences"
      >
        <div class="card grow notitle" use:marcelle={confMatDatasetBrowser} />
      </div>
    </div>
  </div>
  {#if $confmatHasSelection}
    <div class="flex flex-col md:flex-row">
      <div class="card grow-0 confmat" use:marcelle={confmatImage} />
      <div class="card grow" use:marcelle={confmatConfidences} />
    </div>
  {/if}
</section>

<style>
  .confmat {
    width: calc(350px + 2rem);
  }
</style>
