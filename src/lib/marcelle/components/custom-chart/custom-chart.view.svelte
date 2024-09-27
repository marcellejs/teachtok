<script lang="ts">
  import { ViewContainer } from '@marcellejs/design-system';

  export let title: string;
  export let primary: string;
  export let sorted: Array<Array<any>>;
</script>

<ViewContainer {title}>
  <div class="container">
    <!--Show only a few labels or the whole ?-->
    <div class="header">
      <div class="fst-pred" align="center">{primary} <br />({Math.floor(sorted[0][1] * 100)}%)</div>
    </div>
    <div class="other" align="center">
      {#each sorted as pred, index}
        {#if index > 0}
          <div class="pred">
            {pred[0]}:
            <p><b>{pred[1]}</b></p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</ViewContainer>

<style>
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
  }
  .other {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .fst-pred {
    font-size: 32px;
    font-weight: bolder;
    color: green;
  }
  .pred {
    font-size: 20px;
    color: lightskyblue;
    justify-self: center;
  }
</style>
