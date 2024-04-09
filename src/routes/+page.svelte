<script lang="ts">
  import { base } from '$app/paths';
  import { store, type User } from '$lib/marcelle/store';
  export let data: { user: User | null };

  function signout() {
    store.logout().then(() => {
      data.user = null;
    });
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<div class="cont">
  <section>
    <h1
      class="font-title text-primary text-center text-lg transition-all duration-200 md:text-5xl w-full"
    >
      <span class="lowercase">Teach</span>
      <span class="text-base-content uppercase">TOK</span>
    </h1>
    <div class="text-2xl text-center my-6 italic">
      A Collaborative System for Interactive Machine Teaching
    </div>
    <section>
      <h2 class="text-2xl my-6">
        Train your Image Classifier as a team and inspect its performance both on your side or with
        your team !
      </h2>
    </section>
    <section>
      <p>
        With this web application, you and your team can collectively teach an image classifier
        using individual interfaces. Each team member will have access to different features
        organized into pages:
      </p>
      <ul class="list-disc list-outside ml-8 mt-4">
        <li>
          <i>Homepage</i> - Here, you can view your model's performance as a team, including charts showing
          the evolution of classes and accuracy rate.
        </li>
        <li>
          <i>Navbar</i> - This feature helps you track the model's training progress with a status bar,
          and allows you to reload it or access settings.
        </li>
        <li>
          <i>Teach</i> - This section enables you to input images, view the model's predictions, and
          add them to your dataset, with the option to correct associated labels.
        </li>
        <li>
          <i>Share</i> - Here, you can access the images you've personally added and assess the impact
          of these additions on the model's training by recalculating its performance with the collective
          dataset.
        </li>
        <li>
          <i>Dataset</i> - This section provides access to all instances contained in the collective
          dataset, organized by label.
        </li>
      </ul>
      <p>
        Additionally, you can access more advanced features to analyze the model's decisions on the
        collective dataset:
      </p>
      <ul class="list-disc list-outside ml-8 mt-4">
        <li>
          <i>Inspector</i> - Utilizing a confusion matrix, you can gain insight into how the collective
          dataset is labeled by the model. By clicking on specific categories, you can further inspect
          True and Predicted labels, along with confidence plots for selected images.
        </li>
        <li>
          <i>Chat</i> - Here, you have the embedded possibility to exchange information about your personal
          data and send custom messages to debate or discuss aspects of the model's decisions or the
          progression of your teaching as a group.
        </li>
      </ul>
    </section>
    <section class="my-6 text-center">
      {#if data?.user}
        <a class="btn btn-secondary" href="{base}/app/">Go to the app</a>
        <a class="btn btn-secondary" href="{base}/mobile/">Mobile Demo</a>
      {:else}
        <a class="btn btn-secondary" href="{base}/auth/login">Log In</a>
        <a class="btn btn-primary" href="{base}/auth/signup">Create an Account</a>
      {/if}
      {#if data?.user?.role === 'admin'}
        <a class="btn btn-primary" href="{base}/auth/signup">Create an Account</a>
      {/if}
      {#if data?.user}
        <button class="btn btn-error btn-outline" on:click={signout}>Sign out</button>
      {/if}
    </section>
  </section>
</div>

<style>
  .cont {
    max-width: 786px;
    width: 100%;
    margin: 2rem auto;
  }

  section > section > p {
    @apply mt-4;
  }
</style>
