<script lang="ts">
  import {
    collectiveAccuracy,
    type User,
    trainingUpToDate,
    $accuracy as accuracy,
  } from '$lib/marcelle';
  import { store } from '$lib/marcelle';

  $: user = store.user as User;
</script>

<div class="stats">
  <div class="stat w-32 p-2">
    <div class="stat-figure">
      <!-- <div class="avatar online">
        <div class="w-16 rounded-full">
          <img src={user?.avatar || 'https://api.lorem.space/image/face?hash=33791'} alt="" />
        </div>
      </div> -->
    </div>
    <div class="stat-title">My Accuracy</div>
    <div
      class="stat-value"
      class:text-success={$trainingUpToDate}
      class:text-warning={!$trainingUpToDate}
    >
      {$accuracy}%
    </div>
    <!-- <div class="stat-desc">XX% better/worse</div> -->
  </div>

  <div class="stat w-32 p-2">
    <!-- <div class="stat-figure text-info">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    </div> -->
    <div class="stat-title">Team Accuracy</div>
    <div class="stat-value text-info">{$collectiveAccuracy}%</div>
  </div>
</div>
