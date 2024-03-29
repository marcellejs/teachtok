<script>
  // @ts-nocheck
  import Autocomplete from '$lib/Autocomplete.svelte';
  import {
    inputMobile,
    src,
    displayMobile,
    captureMobile,
    myTrainingData,
    confidencesMobile,
    commentsArea,
    comments,
    store,
    label,
  } from '$lib/marcelle';
  import { logEvent } from '$lib/marcelle/log';
  import { marcelle } from '$lib/utils';
  import ModalMobile from '$lib/ModalMobile.svelte';
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
    <div class="conf-row flex-col md:flex-col" bind:this={screenshotElt}>
      <div class="conf-col">
        <div class="card max-w-full">
          <!--half-->
          <div class="m-4" use:marcelle={inputMobile} />
        </div>
      </div>
      <div class="card" use:marcelle={confidencesMobile} />
    </div>
    <div class="mt-4 mb-4 flex flex-row">
      <div class="conf-row">
        <button
          class="btn btn-primary"
          on:click={() => {
            showShareData = true;
          }}
        >
          Add to Dataset
        </button>
      </div>
      <div class="conf-row">
        <button class="btn btn-primary" on:click={openInsightModal}> Share with Group </button>
      </div>
    </div>
    {#if showShareData}
      <ModalMobile
        on:quit={() => {
          showShareData = false;
        }}
        on:load={() => {
          src.$images.set(inputMobile.$images.get());
        }}
      >
        <div style="padding: 1rem;">
          <div class="modal-header">Which label for this image ?</div>
          <div style="padding: 1rem">
            <div class="modal-image" use:marcelle={displayMobile} />
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
                on:click={() => captureMobile.$click.set(undefined)}
              >
                Add Instance
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
      </ModalMobile>
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
  </div>
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
