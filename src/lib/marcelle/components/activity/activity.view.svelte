<script>
  import { Spinner, Button, ViewContainer } from '@marcellejs/design-system';
  import { onMount, tick } from 'svelte';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { base } from '$app/paths';

  dayjs.extend(relativeTime);

  export let title;
  export let dataset;
  export let store;
  export let filterAction;

  let loading = true;
  let msg = '';

  let messages = [];
  onMount(async () => {
    await tick();
    let items = dataset.items().query({ $sort: { updatedAt: -1 } });
    if (filterAction) {
      items = items.query({ action: filterAction });
    }
    messages = await items.toArray();
    loading = false;
    dataset.$changes.subscribe((changes) => {
      for (const { level, type, data } of changes) {
        if (level === 'instance' && type === 'created') {
          if (!filterAction || data.action === filterAction) {
            messages = [data, ...messages];
          }
        }
      }
    });
  });

  function sendMessage() {
    document.getElementById('messageReply').value = '';
    dataset.create({
      action: 'chat',
      comment: msg,
      author: store.user.name,
      public: true,
      team: store.user.team,
    });
  }
</script>

<ViewContainer {title}>
  <div class="activityComponent bg-slate-300">
    {#if loading}
      <Spinner />
    {:else}
      {#if !filterAction}
        <div class="flex p-2">
          <textarea
            id="messageReply"
            class="w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Reply..."
            bind:value={msg}
          />
          <div class="px-2">
            <Button on:click={sendMessage}>Send</Button>
          </div>
        </div>
      {/if}
      <div class="flex flex-col-reverse">
        {#each messages as message}
          <div class:ownMessage={message.author === store.user.name} class="item relative">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="avatar">
                  <div class="w-8 mx-2">
                    <img
                      src="{base}/animals/{message.author.split(' ').slice(1).join('-')}.png"
                      alt=""
                    />
                  </div>
                </div>
                <span class="author mx-1 font-bold">{message.author}</span>
                {#if message.action.includes('dataset')}
                  added {message.instances.length} images to
                  <span class="action mx-1 font-bold">{message.action}</span>
                {:else if message.action.includes('model')}
                  updated the <span class="action mx-1 font-bold">model</span>
                {:else if message.action.includes('insight')}
                  shared insight with the group:
                {:else}
                  said:
                {/if}
              </div>
              <span class="createdAt">{dayjs(message.createdAt).fromNow()}</span>
            </div>
            <div class="m-2">
              <div class="comment mb-2">{message.comment}</div>
              {#if message.action.includes('dataset')}
                <img src={message.thumbnail} alt="Screenshot of the insight" />
              {:else if message.action.includes('insight')}
                <img src={message.thumbnail} alt="Screenshot of the insight" />
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</ViewContainer>

<style>
  .activityComponent {
    height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column-reverse;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
  }

  .item {
    background-color: #f2fafd;
    margin-bottom: 10px;
    border: 1px solid #f2fafd;
    border-radius: 12px;
    padding: 10px;
    margin: 10px;
    width: 60%;
  }
  .ownMessage {
    /* margin-left: 48%; */
    align-self: flex-end;
    background-color: #f2fdf3;
    border-color: #f2fdf3;
  }
  .action {
    color: #ff6666;
  }
  .author {
    color: #009999;
  }
  .createdAt {
    color: #999999;
    font-size: 10pt;
    margin-left: 5px;
  }
  .comment {
    font-size: 14pt;
    color: #636363;
  }

  textarea {
    font-family: inherit;
    padding: 0.5rem;
  }
</style>
