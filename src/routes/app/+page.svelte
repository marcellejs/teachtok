<script lang="ts">
  // @ts-nocheck
  import { base } from '$app/paths';
  import { numClassesChart, accuracyChart, store } from '$lib/marcelle';
  import { logEvent } from '$lib/marcelle/log';
  import ScoreBoard from '$lib/ScoreBoard.svelte';
  import { marcelle } from '$lib/utils';
  import WelcomeCard from '$lib/WelcomeCard.svelte';
  import { onMount } from 'svelte';

  $: user = store.user as User;

  let qrelt: HTMLDivElement;
  onMount(() => {
    logEvent('navigate', 'dashboard');
    const qrcode = new QRCode(qrelt, {
      text: `https://marcelle.lisn.upsaclay.fr${base}/auth/login?username=${user.email.split('@')[0].split('.').join(' ')}&mobile=1`,
      width: 200,
      height: 200,
      colorDark: '#5868bf',
      colorLight: '#ffffff',
    });
  });
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  <div class="marcelle flex flex-col gap-2 items-stretch">
    <WelcomeCard />
    <div class="grow">
      <div class="card" use:marcelle={accuracyChart} />
      <div class="card" use:marcelle={numClassesChart} />
    </div>
    <ScoreBoard />
  </div>
</section>

<style>
  section {
    width: 100%;
    flex: 1;
  }
</style>
