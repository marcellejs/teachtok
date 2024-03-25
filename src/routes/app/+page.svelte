<script lang="ts">
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
  <div class="marcelle flex gap-2">
    <div class="flex flex-col items-stretch">
      <WelcomeCard />
      <div class="card w-96 bg-base-100 shadow-xl flex items-center justify-center">
        <!-- <a
          href="{base}/auth/login?username={user.email.split('@')[0].split('.').join(' ')}&mobile=1"
          >https://marcelle.lisn.upsaclay.fr{base}/auth/login?username={user.email
            .split('@')[0]
            .split('.')
            .join(' ')}&mobile=1</a
        > -->
        <h3 class="font-bold mb-2">Connect your mobile:</h3>
        <div bind:this={qrelt}></div>
      </div>
      <ScoreBoard />
    </div>

    <div class="grow">
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
