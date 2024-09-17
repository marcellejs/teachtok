<script lang="ts">
  import { type User, $numClasses as numClasses, collectiveClasses } from '$lib/marcelle';
  import { store } from '$lib/marcelle';

  $: user = store.user as User;
</script>

<div class="stats justify-center">
  <div class="stat w-32 p-2">
    <div class="stat-title">My Classes</div>
    <div class="stat-value text-success">{$numClasses}/10</div>
  </div>

  <div class="stat w-32 p-2">
    <div class="stat-title">Team Classes</div>
    <div class="stat-value text-info">{$collectiveClasses}/10</div>
  </div>
</div>
