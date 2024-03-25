<script>
  // @ts-nocheck
  console.log('Importing...');
  import HeaderMobile from '$lib/HeaderMobile.svelte';
  export let data;

  console.log('Here...', data);
</script>

<div>
  <HeaderMobile user={data?.user} />
  <slot />
</div>
