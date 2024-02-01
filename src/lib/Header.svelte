<script context="module">
  import { allTrainingData, crossValidation } from '$lib/marcelle';

  allTrainingData.ready.then(crossValidation);
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { store, metaCVModel, $accuracy as accuracy, trainingUpToDate } from '$lib/marcelle';
  import { base } from '$app/paths';

  export let user: { avatar: string; name: string };

  let trainingStatus = metaCVModel.$training
    .map(({ status }) => {
      if (status === 'epoch') {
        return 'training';
      }
      return status;
    })
    .startWith('idle')
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
    <div class="flex-1">
      <span
        class="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]"
        data-tip="Menu"
        ><label for="drawer" class="btn btn-square btn-ghost drawer-button lg:hidden"
          ><svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            /></svg
          ></label
        ></span
      >
      <div class="w-36 flex flex-col mr-4">
        <div class=" text-sm w-36">Status: {$trainingStatus}</div>
        <progress
          class="progress progress-info w-36 mt-1"
          class:progress-success={$trainingStatus === 'success'}
          class:progress-error={$trainingStatus === 'error'}
          value={prog}
          max="1"
        ></progress>
      </div>
    </div>
    <div class="navbar-end flex-none">
      <button
        class="btn btn-sm btn-circle btn-outline mr-2"
        class:btn-success={$trainingUpToDate}
        class:btn-warning={!$trainingUpToDate}
        class:loading={$trainingStatus === 'training'}
        class:disabled={$trainingStatus === 'training'}
        on:click={crossValidation}
      >
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
      </button>

      <div
        class="tooltip tooltip-bottom"
        class:tooltip-success={$trainingUpToDate}
        class:tooltip-warning={!$trainingUpToDate}
        data-tip={$trainingUpToDate
          ? 'Everything is up to date!'
          : 'New data has been added, the performance score is outdated'}
      >
        <div
          class="mr-4 text-left"
          class:text-success={$trainingUpToDate}
          class:text-warning={!$trainingUpToDate}
        >
          <span class="hidden md:inline-block">My Accuracy: </span>
          <span class="inline-flex w-16 overflow-hidden">{$accuracy || '??'} %</span>
        </div>
      </div>
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar" for="">
          <div class="w-10 rounded-full">
            <img
              src={user?.avatar || 'https://api.lorem.space/image/face?hash=33791'}
              alt="profile pic"
            />
          </div>
        </label>
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
