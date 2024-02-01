<script lang="ts">
  import fuzzysort from 'fuzzysort';
  import { createEventDispatcher } from 'svelte';

  export let options = [];
  export let inputValue = '';
  export let invalid = false;
  let selection = options;
  let showOptions = false;

  const dispatch = createEventDispatcher();

  $: selection = inputValue ? fuzzysort.go(inputValue, options).map((x) => x.target) : options;
  $: dispatch('value', inputValue);
  // [{score:-18, obj:{file:'MeshRenderer.cpp'}}, {score:-6009, obj:{file:'Monitor.cpp'}}]

  function selectOption(opt) {
    inputValue = opt;
    showOptions = false;
  }
</script>

<!-- <svelte:window on:keydown={navigateList} /> -->

<div class="mb-8 w-full">
  <!-- <label tabindex="0" class="btn m-1"> -->
  <div class="dropdown w-full">
    <input
      class="input input-bordered w-full"
      class:input-error={invalid}
      type="text"
      placeholder="Search Labels"
      bind:value={inputValue}
      on:focus={() => {
        showOptions = true;
      }}
    />
    {#if showOptions}
      <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
        {#each selection as option}
          <li><button on:click={() => selectOption(option)}>{option}</button></li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
