<script lang="ts">
  import { page } from '$app/stores';

  let bc = [{ name: 'Home', href: '/' }];
  console.log('$page.url.pathname', $page.url.pathname);
  console.log('$page.url.pathname.split( / ).slice(1)', $page.url.pathname.split('/').slice(1));
  for (const p of $page.url.pathname
    .split('/')
    .slice(1)
    .filter((x) => !!x)) {
    bc.push({
      name: p[0].toUpperCase() + p.slice(1),
      href: bc[bc.length - 1].href + '/' + p,
    });
  }
</script>

<div>
  <header class="flex justify-between items-center">
    <div class="text-sm breadcrumbs text-gray-400">
      <ul>
        {#each bc as { name, href }}
          <li><a {href}>{name}</a></li>
        {/each}
      </ul>
    </div>

    <button class="btn btn-circle btn-outline" on:click={() => history.back()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        /></svg
      >
    </button>
  </header>
  <slot />
</div>

<style>
  div {
    max-width: 786px;
    width: 100%;
    margin: 2rem auto;
  }
</style>
