<script>
  import Autocomplete from '$lib/Autocomplete.svelte';
  import {
    input,
    inputDisplay,
    capture,
    myTrainingData,
    myConfidences,
    commentsArea,
    comments,
    store,
    label,
  } from '$lib/marcelle';
  import { logEvent } from '$lib/marcelle/log';
  import { marcelle } from '$lib/utils';
  import Modal from '$lib/Modal.svelte';
  import html2canvas from 'html2canvas';
  import { onMount } from 'svelte';

  let screenshotElt;
  let screenshotImg;

  $: currentLabel = label.$value;
  const categories = [
    'African Dance',
    'Ballet',
    'Contemporary',
    'Hip Hop',
    'Jazz',
    'Persian Dance',
    'Salsa',
    'Tango',
    'Tap Dancing',
    'Voguing',
  ];

  let showShareData = false;
  let showShareInsight = false;
  myTrainingData.$changes.subscribe((changes) => {
    for (const { level, type } of changes) {
      if (level === 'instance' && type === 'created') {
        showShareData = false;
      }
    }
  });

  function openInsightModal() {
    html2canvas(screenshotElt, { scale: 2.5 }).then(function (canvas) {
      screenshotImg = canvas.toDataURL('image/jpeg');
      showShareInsight = true;
    });
  }

  function shareInsight(action, comment, image) {
    return comments.create({
      action,
      comment,
      thumbnail: image,
      author: store.user.name,
      public: true,
      team: store.user.team,
    });
  }

  onMount(() => {
    logEvent('navigate', 'teach');
  });
</script>

<svelte:head>
  <title>Teach</title>
</svelte:head>

<section class="marcelle vertical">
  <div>
    <div class="conf-row flex-col md:flex-row" bind:this={screenshotElt}>
      <div class="conf-col">
        <div class="card half max-w-full">
          <div use:marcelle={input} />
          <div class="flex grow justify-center items-center">
            <div class="notitle" use:marcelle={inputDisplay} />
          </div>
        </div>
      </div>
      <div class="card" use:marcelle={myConfidences} />
    </div>
    <div class="conf-row half max-w-full">
      <button
        class="btn btn-primary"
        on:click={() => {
          showShareData = true;
        }}
      >
        Use Image for Teaching
      </button>
    </div>
  </div>
  <div class="conf-row">
    <button class="btn btn-primary" on:click={openInsightModal}>
      Share Insight with the Group
    </button>
    <!-- <button class="button export" on:click={openInsightModal}>Share Insight with the Group</button> -->
  </div>
  {#if showShareData}
    <Modal
      on:quit={() => {
        showShareData = false;
      }}
    >
      <div style="padding: 1rem;">
        <div class="modal-header">Use this image for teaching?</div>
        <div style="padding: 1rem">
          <Autocomplete
            options={categories}
            inputValue={$currentLabel}
            on:value={({ detail }) => {
              label.$value.set(detail);
            }}
            invalid={!categories.includes($currentLabel)}
          />
          <div class="modal-row">
            <button
              class="btn btn-secondary"
              disabled={!categories.includes($currentLabel)}
              on:click={() => capture.$click.set(undefined)}
            >
              Record image
            </button>
            <button
              class="btn btn-outline btn-error"
              on:click={() => {
                showShareData = false;
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  {/if}
  {#if showShareInsight}
    <Modal
      on:quit={() => {
        showShareInsight = false;
      }}
    >
      <div style="padding: 1rem">
        <div class="modal-header">Share this insight with the group?</div>
        <div style="padding: 1rem">
          <div class="notitle" use:marcelle={commentsArea} />
          <img src={screenshotImg} alt="Screenshot of the insight" class="output" />
          <div class="modal-row">
            <button
              class="btn btn-secondary"
              on:click={() => {
                shareInsight('insight', commentsArea.$value.value, screenshotImg).then(() => {
                  showShareInsight = false;
                  commentsArea.$value.value = '';
                });
              }}
            >
              Share with the group
            </button>
            <button
              class="btn btn-outline btn-error"
              on:click={() => {
                showShareInsight = false;
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  {/if}
</section>

<style>
  .vertical {
    min-height: calc(100vh - 6rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
  }

  .conf-row {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .card {
    flex-grow: 1;
  }

  .conf-col {
    display: flex;
    flex-direction: column;
  }

  .half {
    width: 500px;
  }

  .modal-header {
    width: 100%;
    padding: 1rem;
    font-weight: 800;
  }

  .modal-row {
    display: flex;
    justify-content: space-between;
  }

  .output {
    width: 100%;
  }
</style>
