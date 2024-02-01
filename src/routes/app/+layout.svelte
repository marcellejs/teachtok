<script>
  console.log('Importing...');
  import Header from '$lib/Header.svelte';
  import Sidebar from '$lib/Sidebar.svelte';

  /** @type {import('./$types').LayoutData} */
  export let data;
  console.log('Here...', data);
</script>

<div class="drawer lg:drawer-open">
  <input id="drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <Header user={data?.user} />
    <div class="right">
      <slot />
    </div>
  </div>
  <div class="drawer-side" style="scroll-behavior: smooth; scroll-padding-top: 5rem;">
    <label for="drawer" class="drawer-overlay" />
    <Sidebar />
  </div>
</div>

<style>
  .right {
    margin-top: 4rem;
    width: 100%;
    padding: 1rem;
    min-height: calc(100vh - 4rem);
    background-color: #edf2f7;
  }
</style>
