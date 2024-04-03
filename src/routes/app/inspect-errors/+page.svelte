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
    <div class="tooltip tooltip-bottom tooltip-warning">
      <!--data-tip="select each square to see true/false predictions"-->
      <div class="card w-full" use:marcelle={cvConfusion} />
    </div>
    <div class="flex flex-col w-full">
      <!--
      <div class=" shadow mt-2 mx-1">
        <div class="stat px-1.125">
          <div class="stat-title">True Label</div>
          <div class="stat-value text-xl">{$confSelection?.y || ''}</div>
        </div>

        <div class="stat">
          <div class="stat-title">Predicted Label</div>
          <div
            class="stat-value text-xl"
            class:text-success={$confSelection?.x === $confSelection?.y}
            class:text-error={$confSelection?.x !== $confSelection?.y}
          >
            {$confSelection?.x || ''}
          </div>
        </div>
      </div>
    -->
      <div class="card w-full">
        <div class="flex justify-center gap-12">
          <div class="flex flex-col w-fit">
            <div>True Label</div>
            <div class=" font-bold text-xl">{$confSelection?.y || ''}</div>
          </div>
          <div class="flex flex-col w-fit">
            <div>Predicted Label</div>
            <div
              class="font-bold text-xl"
              class:text-success={$confSelection?.x === $confSelection?.y}
              class:text-error={$confSelection?.x !== $confSelection?.y}
            >
              {$confSelection?.x || ''}
            </div>
          </div>
        </div>
      </div>
      <div class="tooltip tooltip-bottom tooltip-warning">
        <!--data-tip="select each instance to see confidences"-->
        <div class="card w-full notitle" use:marcelle={confMatDatasetBrowser} />
      </div>
    </div>
  </div>
  {#if $confmatHasSelection}
    <div class="flex flex-col md:flex-row">
      <div class="card" use:marcelle={confmatImage} />
      <div class="card" use:marcelle={confmatConfidences} />
    </div>
  {/if}
</section>
