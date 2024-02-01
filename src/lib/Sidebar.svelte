<script lang="ts">
  import { page } from '$app/stores';
  import Fa from 'svelte-fa/src/fa.svelte';
  import { faHome } from '@fortawesome/free-solid-svg-icons';
  import { faImage } from '@fortawesome/free-solid-svg-icons';
  import { faUpload } from '@fortawesome/free-solid-svg-icons';
  import { faComment } from '@fortawesome/free-solid-svg-icons';
  import { faDatabase } from '@fortawesome/free-solid-svg-icons';
  import { faPen } from '@fortawesome/free-solid-svg-icons';
  import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
  import { newData, newMessages } from './marcelle';
  import { base } from '$app/paths';
</script>

<nav class="w-80 bg-white">
  <div class="z-20 bg-opacity-90 backdrop-blur sticky top-0 items-center gap-2 p-4 self-center">
    <a
      href="{base}/app"
      aria-current="page"
      aria-label="Homepage"
      class="flex-0 btn btn-ghost px-2"
    >
      <span
        class="font-title text-primary inline-flex text-center text-lg transition-all duration-200 md:text-3xl"
      >
        <span class="lowercase">Teach</span>
        <span class="text-base-content uppercase">TOK</span>
      </span>
    </a>
  </div>
  <div class="side-nav-top">
    <ul class="menu flex flex-col p-0 px-4">
      <li class="menu-title"><span class="text-primary">Main Features</span></li>
      <li>
        <a class="flex gap4" class:active={$page.url.pathname === `${base}/app`} href="{base}/app/">
          <span class="flex-none"><Fa icon={faHome} /></span>
          <span class="flex-1">Home</span></a
        >
      </li>
      <li>
        <a
          class="flex gap4"
          class:active={$page.url.pathname === `${base}/app/teach`}
          href="{base}/app/teach"
        >
          <span class="flex-none"><Fa icon={faImage} /></span>
          <span class="flex-1">Teach</span></a
        >
      </li>
      <li>
        <a
          class="flex gap4"
          class:active={$page.url.pathname === `${base}/app/share`}
          href="{base}/app/share"
        >
          <span class="flex-none"><Fa icon={faUpload} /></span>
          <span class="flex-1">Share Images</span></a
        >
      </li>
      <li>
        <a
          class="flex gap4"
          class:active={$page.url.pathname === `${base}/app/chat`}
          href="{base}/app/chat"
        >
          <span class="flex-none"><Fa icon={faComment} /></span>
          <span class="flex-1">Chat</span>
          {#if $newMessages > 0}
            <span class="badge badge-secondary">{$newMessages} new messages</span>
          {/if}
        </a>
      </li>
      <li>
        <a
          class="flex gap4"
          class:active={$page.url.pathname === `${base}/app/dataset`}
          href="{base}/app/dataset"
        >
          <span class="flex-none"><Fa icon={faDatabase} /></span>
          <span class="flex-1">Dataset</span>
          {#if $newData > 0}
            <span class="badge badge-secondary">new data!</span>
          {/if}
        </a>
      </li>
    </ul>
  </div>
  <div class="side-nav-bottom">
    <ul class="menu flex flex-col p-0 px-4">
      <li class="menu-title"><span class="text-primary">Advanced Features</span></li>

      <li>
        <a
          class="flex gap4"
          class:active={$page.url.pathname === `${base}/app/inspect-errors`}
          href="{base}/app/inspect-errors"
        >
          <span class="flex-none"><Fa icon={faPen} /></span>
          <span class="flex-1">Inspect Predictions</span></a
        >
      </li>
    </ul>
  </div>
  <div class="side-nav-bottom">
    <ul class="menu flex flex-col p-0 px-4">
      <li class="menu-title"><span class="text-primary">Need Some Help?</span></li>

      <li>
        <a
          class="flex gap4"
          class:active={$page.url.pathname === `${base}/app/help`}
          href="{base}/app/help"
        >
          <span class="flex-none"><Fa icon={faInfoCircle} /></span>
          <span class="flex-1">Tutorial</span></a
        >
      </li>
    </ul>
  </div>
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
  }
</style>
