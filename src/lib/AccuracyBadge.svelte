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

<div class="stats justify-center">
  <div class="stat w-32 p-2">
    <div class="stat-figure"></div>
    <div class="stat-title">My Accuracy</div>
    <div
      class="stat-value"
      class:text-success={$trainingUpToDate}
      class:text-warning={!$trainingUpToDate}
    >
      {$accuracy}%
    </div>
  </div>

  <div class="stat w-32 p-2">
    <div class="stat-title">Team Accuracy</div>
    <div class="stat-value text-info">{$collectiveAccuracy}%</div>
  </div>
</div>
