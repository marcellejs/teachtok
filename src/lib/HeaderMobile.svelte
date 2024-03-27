<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    store,
    metaCVModel,
    $accuracy as accuracy,
    trainingUpToDate,
    metaCVBatch,
  } from '$lib/marcelle';
  import { base } from '$app/paths';

  export let user: { avatar: string; name: string };
  let cvStatus = metaCVBatch.$status.map((x) => x.status);

  let trainingStatus = metaCVModel.$training;
  let isLoaded = metaCVModel.$training
    .map(({ status }) => {
      if (status === 'loaded') {
        return true;
      }
      return false;
    })
    .startWith(false)
    .hold();

  let progress = metaCVModel.$training
    .map(({ status, epoch, epochs }) => {
      let type: Progress['type'] = 'default';
      let p = epochs > 0 ? (epoch + 1) / epochs : null;
      if (status === 'error') {
        type = 'danger';
      }
      if (status === 'idle') {
        type = 'idle';
        p = 0;
      }
      if (['success', 'loaded'].includes(status)) {
        type = 'success';
        p = 1;
      }
      if (['start', 'loading'].includes(status)) {
        p = null;
      }
      return {
        progress: p,
        type,
      };
    })
    .startWith({ progress: 0, type: 'idle' })
    .hold();

  function signout() {
    goto(`${base}/`).then(() => {
      store.logout();
    });
  }

  $: prog = $progress?.progress ? $progress.progress : 0;
</script>

<header>
  <div class="navbar bg-base-100 max-h-16">
    <div class="flex-1"></div>
    <div class="navbar-end flex-none gap-8">
      <!-- <button
        class="btn btn-sm btn-circle btn-outline mr-2"
        class:btn-success={$trainingUpToDate}
        class:btn-warning={!$trainingUpToDate}
        class:loading={$trainingStatus === 'training'}
        class:disabled={$trainingStatus === 'training'}
      >
        <!--on:click={crossValidation}--
        {#if $trainingStatus !== 'training'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clip-rule="evenodd"
            />
          </svg>
        {/if}
      </button> -->

      <div
        class="tooltip tooltip-bottom"
        class:tooltip-success={$isLoaded}
        class:tooltip-warning={!$isLoaded}
        data-tip={$trainingUpToDate
          ? 'Everything is up to date!'
          : 'New data has been added, the performance score is outdated'}
      >
        <div class="mr-4 text-left" class:text-success={$isLoaded} class:text-warning={!$isLoaded}>
          {#if $isLoaded}
            <span class="hidden md:inline-block">Model Loaded, Accuracy: </span>
            <span class="inline-flex w-16 overflow-hidden">{$accuracy || '??'} %</span>
          {:else}
            <span class="hidden md:inline-block">Loading...</span>
          {/if}
        </div>
      </div>

      <div class="dropdown dropdown-end">
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <label tabindex="0" class="btn btn-ghost btn-circle avatar" for="">
          <div class="w-10 rounded-full">
            <img
              src={user?.avatar
                ? `${base}/animals/${user?.avatar}`
                : 'https://api.lorem.space/image/face?hash=33791'}
              alt="profile pic"
            />
          </div>
        </label>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li><a href="/settings">Settings</a></li>
          <li><button on:click={signout}>Logout</button></li>
        </ul>
      </div>
    </div>
  </div>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    left: 20rem;
    right: 0;
    z-index: 1;
  }

  @media (max-width: 1024px) {
    header {
      /* position: relative; */
      left: 0;
    }
  }
</style>
