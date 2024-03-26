<script>
  // @ts-nocheck
  console.log('Importing...');
  import HeaderMobile from '$lib/HeaderMobile.svelte';
  export let data;

  console.log('Here...', data);
</script>

<div>
  <!-- removing the navbar doesn't makes more space (the webcam ViewContainer title was just hidden)-->
  <!--<HeaderMobile user={data?.user} />-->
  <slot />
</div>
