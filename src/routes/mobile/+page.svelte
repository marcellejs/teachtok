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
    allTrainingData,
  } from '$lib/marcelle';
  import { base } from '$app/paths';
  import { logEvent } from '$lib/marcelle/log';
  import { marcelle } from '$lib/utils';
  import ModalMobile from '$lib/ModalMobile.svelte';
  import html2canvas from 'html2canvas';
  import { onMount } from 'svelte';
  import FloatButton from '$lib/FloatButton.svelte';

  let screenshotElt;
  let screenshotImg;

  $: labelValue = label.$value;

  const categories = [];
  async function getCategory() {
    const tmp = await allTrainingData.distinct('y');
    categories.push(...tmp);
  }
  getCategory();
  /*const categories = [
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
  ];*/

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
          <div class="notitle m-2" use:marcelle={inputMobile} />
        </div>
      </div>
      <div class="mb-4 flex flex-row">
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
        <!-- <div class="conf-row">
          <button class="btn btn-primary" on:click={openInsightModal}> Share with Group </button>
        </div> -->
      </div>
      <!--scaling the chart to 0.5 and putting the buttons in-between camera & chart is the most fastforward solution-->
      <div class="chart" use:marcelle={confidencesMobile} />
    </div>
    {#if showShareData}
      <ModalMobile
        on:quit={() => {
          showShareData = false;
        }}
        on:load={() => {
          src.$images.set(inputMobile.$images.get());
          src.$thumbnails.set(inputMobile.$thumbnails.get());
        }}
      >
        <div style="padding: 1rem;">
          <div class="modal-header">Which label for this image ?</div>
          <div style="padding: 1rem">
            <div class="modal-image mb-4" use:marcelle={displayMobile} />
            <!--<input
              type="text"
              placeholder="Choose a label"
              class="input input-bordered w-full mb-4"
              bind:value={$labelValue}
            />-->
            <Autocomplete
              options={categories}
              inputValue={$labelValue}
              on:value={({ detail }) => {
                label.$value.set(detail);
              }}
            />
            <div class="modal-row">
              <button
                class="btn btn-secondary"
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
      <ModalMobile
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
      </ModalMobile>
    {/if}
  </div>
  <!-- <FloatButton href="{base}/mobile/chat/" img="{base}/mobile/chat.svg" /> -->
  <div class="btm-nav">
    <a href="{base}/mobile" class="active">
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
    <a href="{base}/mobile/share">
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
  .chart {
    /*margin-top: -20%;*/
    margin-top: -80px;
    scale: 0.6;
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
