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
  <div class="marcelle flex flex-col md:flex-row gap-2">
    <div class="flex flex-col items-stretch">
      <WelcomeCard />
      <ScoreBoard />
    </div>

    <div class="flex flex-col grow">
      <div class="card" use:marcelle={accuracyChart} />
      <div class="card" use:marcelle={numClassesChart} />
    </div>
  </div>
</section>

<style>
  section {
    width: 100%;
    flex: 1;
  }
</style>
