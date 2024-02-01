<script lang="ts">
  import { base } from '$app/paths';
  import { collectiveAccuracy, newData, type User } from '$lib/marcelle';
  import { store } from '$lib/marcelle';
  import AccuracyBadge from './AccuracyBadge.svelte';
  import ClassesBadge from './ClassesBadge.svelte';

  $: user = store.user as User;
</script>

<div class="card w-96 bg-base-100 shadow-xl">
  <figure>
    <div class="w-24">
      <img
        src={user?.avatar || 'https://api.lorem.space/image/face?hash=33791'}
        class="w-24 h-24"
        alt=""
      />
    </div>
  </figure>
  <div class="card-body">
    <h2 class="card-title">Welcome back, {user.name} !</h2>
    <p>
      {$newData} images were added since your last visit, and the accuracy reached {$collectiveAccuracy}%!
    </p>
    <div>
      <AccuracyBadge />
      <ClassesBadge />
    </div>
    <div class="flex flex-row gap-2 justify-start mt-4">
      <a class="btn btn-secondary btn-sm" href="{base}/app/dataset">See the Library</a>
      <a class="btn btn-secondary btn-sm" href="{base}/app/teach">Teach</a>
    </div>
  </div>
</div>
