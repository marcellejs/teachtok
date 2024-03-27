<script>
  // @ts-nocheck
  import HeaderMobile from '$lib/HeaderMobile.svelte';
  export let data;
</script>

<div>
  <!-- removing the navbar doesn't makes more space (the webcam ViewContainer title was just hidden)-->
  <HeaderMobile user={data?.user} />
  <slot />
</div>
