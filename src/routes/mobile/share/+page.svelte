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

  import { marcelle } from '$lib/utils';
  import { Button } from '@marcellejs/design-system';
  import Modal from '$lib/Modal.svelte';
  import html2canvas from 'html2canvas';
  import { onDestroy } from 'svelte';
  import { base } from '$app/paths';

  let showTrainModel = false;

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
  <div class="btm-nav">
    <a href="{base}/mobile">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
        />
      </svg>
    </a>
    <a href="{base}/mobile/share" class="active">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
        />
      </svg>
    </a>
    <a href="{base}/mobile/chat">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
        />
      </svg>
    </a>
  </div>
</section>

<style>
  .conf-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .card {
    flex-grow: 1;
  }
</style>
