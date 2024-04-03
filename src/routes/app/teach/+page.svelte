<script>
  // @ts-nocheck
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
    allTrainingData,
  } from '$lib/marcelle';
  import { logEvent } from '$lib/marcelle/log';
  import { marcelle } from '$lib/utils';
  import Modal from '$lib/Modal.svelte';
  import html2canvas from 'html2canvas';
  import { onMount } from 'svelte';

  let screenshotElt;
  let screenshotImg;

  $: labelValue = label.$value;

  $: currentLabel = label.$value;
  // const categories = [
  //   'African Dance',
  //   'Ballet',
  //   'Contemporary',
  //   'Hip Hop',
  //   'Jazz',
  //   'Persian Dance',
  //   'Salsa',
  //   'Tango',
  //   'Tap Dancing',
  //   'Voguing',
  // ];

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

  let categories = [];
  onMount(() => {
    logEvent('navigate', 'teach');
    allTrainingData.distinct('y').then((res) => {
      categories = res;
      console.log('distinct y', res);
    });
  });
</script>

<svelte:head>
  <title>Teach</title>
</svelte:head>

<section class="marcelle vertical">
  <div>
    <div class="flex-col md:flex-row" bind:this={screenshotElt}>
      <div class="conf-col">
        <div class="card">
          <div class="marcelle-input notitle" use:marcelle={input} />
          <div class="flex justify-center items-center pt-2">
            <div class="notitle" use:marcelle={inputDisplay} />
          </div>
        </div>
      </div>
      <div class="card" use:marcelle={myConfidences} />
    </div>
    <div class="conf-row">
      <button
        class="btn btn-primary"
        on:click={() => {
          showShareData = true;
        }}
      >
        Teach
      </button>
      <button class="btn btn-primary" on:click={openInsightModal}> Share insights </button>
    </div>
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
          />
          <div class="modal-row">
            <button
              class="btn btn-secondary"
              disabled={!$currentLabel}
              on:click={() => capture.$click.set(undefined)}
            >
              Record
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
              Share
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
  .btn {
    scale: 1.25;
  }
  .vertical {
    min-height: calc(100vh - 6rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
  }

  .conf-row {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin-top: 16px;
  }

  .card {
    flex-grow: 1;
  }

  .conf-col {
    display: flex;
    flex-direction: column;
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
