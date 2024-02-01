<script lang="ts">
  import { base } from '$app/paths';
  import { type User, getScores } from '$lib/marcelle';
  import { store } from '$lib/marcelle';

  $: user = store.user as User;
</script>

<div class="card w-96 bg-base-100 shadow-xl">
  <figure>
    <div class="w-24">
      <img src="{base}/crown.png" class="w-24 h-24" alt="" />
    </div>
  </figure>
  <div class="card-body">
    <h2 class="card-title text-center">Score Board</h2>
    {#await getScores() then scores}
      <div class="stats stats-vertical">
        {#each scores as { team, accuracy, instances, nClasses }}
          <div class="stat">
            {#if team === user?.team}
              <div class="stat-figure text-secondary">
                <div class="avatar online">
                  <div class="w-16 rounded-full">
                    <img
                      src={user?.avatar || 'https://api.lorem.space/image/face?hash=33791'}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            {/if}
            <div class="stat-title">
              Team {team}
              {#if team === user?.team}(my team){/if}
            </div>
            <div class="stat-value" class:text-success={team === user?.team}>{accuracy}%</div>
            <div class="stat-desc opacity-100">
              <span
                class="text-error font-bold"
                class:text-success={nClasses === 10}
                class:text-warning={nClasses >= 7 && nClasses < 10}>{nClasses} classes</span
              >, {instances} images
            </div>
          </div>
        {/each}
      </div>
    {/await}
  </div>
</div>
