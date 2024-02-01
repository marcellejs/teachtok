<script>
  import {
    commentsArea,
    exportBtnTrain,
    myTrainingDataBrowser,
    crossValidation,
    $accuracy as accuracy,
    $numClasses as numClasses,
    comments,
    store,
    myTrainingData,
    allTrainingData,
    trainingUpToDate,
    metaCVModel,
  } from '$lib/marcelle';
  import { logEvent } from '$lib/marcelle/log';

  import { marcelle } from '$lib/utils';
  import { Button } from '@marcellejs/design-system';
  import Modal from '$lib/Modal.svelte';

  let showTrainModel = false;

  // exportBtnTrain.$click.subscribe(() => {
  //   showTrainModel = false;
  // });

  import html2canvas from 'html2canvas';
  import { onDestroy, onMount } from 'svelte';

  let screenshotElt;
  let screenshotImg;

  function openDataModal() {
    html2canvas(screenshotElt, { scale: 2.5 }).then(function (canvas) {
      screenshotImg = canvas.toDataURL('image/jpeg');
      showTrainModel = true;
    });
  }

  const unSub = exportBtnTrain.$click.subscribe(async () => {
    const instances = [];
    const allYs = [];
    const myInstances = await myTrainingData.items().toArray();
    for (const { id, y } of myInstances) {
      await allTrainingData.patch(id, { public: true });
      instances.push(id);
      allYs.push(y);
    }
    const labels = Array.from(new Set(allYs));
    await comments.create({
      action: 'dataset',
      comment: commentsArea.$value.get(),
      instances,
      label: labels,
      thumbnail: screenshotImg,
      accuracy: accuracy.get(),
      nClasses: numClasses.get(),
      author: store.user.name,
      public: true,
      team: store.user.team,
    });
    showTrainModel = false;
    commentsArea.$value.value = '';
    let i = 0;
    for (const model of metaCVModel.models) {
      model.save(store, `lassifier-${++i}`);
    }
  });

  onDestroy(unSub);

  onMount(() => {
    logEvent('navigate', 'share');
  });
</script>

<svelte:head>
  <title>Share my Data</title>
</svelte:head>

<section class="marcelle">
  <div class="conf-row items-stretch" bind:this={screenshotElt}>
    <div class="card" use:marcelle={myTrainingDataBrowser} />
    <div class="w-80 flex flex-col justify-between items-center my-2 mx-1">
      <div class="stats grow">
        <div class="stat">
          <div class="stat-title">Overall Accuracy</div>
          <div class="stat-value text-success w-full">{$accuracy || '??'}%</div>
          <!-- <div class="stat-desc text-error">XX% better than the collective model</div> -->
          <div class="stat-actions">
            <button class="btn btn-sm btn-outline btn-accent" on:click={crossValidation}>
              Recompute Performance
            </button>
          </div>
        </div>
      </div>
      <div
        class="tooltip tooltip-bottom m-4"
        class:tooltip={!$trainingUpToDate}
        class:tooltip-success={$trainingUpToDate}
        class:tooltip-warning={!$trainingUpToDate}
        data-tip="New data has been added, the performance score is outdated"
      >
        <button
          class="btn"
          class:btn-secondary={$trainingUpToDate}
          class:btn-disabled={!$trainingUpToDate}
          style="margin-right: 7%;"
          on:click={openDataModal}
        >
          Share
        </button>
      </div>
    </div>
  </div>

  {#if showTrainModel}
    <Modal
      on:quit={() => {
        showTrainModel = false;
      }}
    >
      <div style="padding: 1rem">
        <div class="modal-header">Share this data?</div>
        <div style="padding: 1rem">
          <div class="notitle" use:marcelle={commentsArea} />
          <div class="modal-row">
            <div class="notitle" use:marcelle={exportBtnTrain} />

            <Button
              type="danger"
              on:click={() => {
                showTrainModel = false;
              }}>Cancel</Button
            >
          </div>
        </div>
      </div>
    </Modal>
  {/if}
</section>

<style>
  .conf-row {
    display: flex;
    justify-content: right;
    width: 100%;
  }

  .card {
    flex-grow: 1;
  }

  .modal-header {
    width: 100%;
    padding: 1rem;
    font-weight: 800;
  }

  .modal-row {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
  }

  .notitle :global(.card-title) {
    display: none;
  }
</style>
