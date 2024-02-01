<script>
  import { activity } from '$lib/marcelle/components';
  import { comments, newMessages, store } from '$lib/marcelle';
  import { marcelle } from '$lib/utils';
  import { onMount } from 'svelte';
  import { logEvent } from '$lib/marcelle/log';

  const act = activity(comments, store);

  onMount(() => {
    localStorage.setItem('lastChatViewed', new Date(Date.now()).toISOString());
    newMessages.set(0);
    logEvent('navigate', 'chat');
  });
</script>

<svelte:head>
  <title>Chat</title>
</svelte:head>

<section class="marcelle">
  <div class="conf-row">
    <div class="card" use:marcelle={act} />
  </div>
</section>

<style>
  .conf-row {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .card {
    flex-grow: 1;
  }
</style>
