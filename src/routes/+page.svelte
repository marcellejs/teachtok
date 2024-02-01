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
    <div class="text-2xl text-center my-6 italic">Study of Collaborative Machine Teaching</div>
    <section>
      <h2 class="text-2xl my-6">Goal of the Research Project</h2>
      <p>
        This study looks at how a group of people, who are not machine learning specialists, can
        teach a machine learning system together. The main goal of this project is to understand how
        people can cooperate to build a classifier that can recognize dance styles or postures from
        images.
      </p>
    </section>
    <section>
      <h2 class="text-2xl my-6">What we expect from you</h2>
      <p>
        In this study, you will teach a machine learning system to recognize dance styles, postures
        and movements from images. This process will be collaborative, meaning that you will teach
        this system together with a group of participants. You will be provided with credentials
        (pseudonym, password) to log in a web application where you will be able to:
      </p>
      <ul class="list-disc list-outside ml-8 mt-4">
        <li>Communicate with others through a chat</li>
        <li>
          Test the performance of the model by providing images and looking at what is predicted by
          the model
        </li>
        <li>
          Teach the model by providing new images and associated labels so that it gets better at
          identifying particular dance styles or movements from images. You will be free to define
          the categories that the system can recognize.
        </li>
      </ul>
      <div class="m-8">
        <div class="alert shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              /></svg
            >
            <span>
              While you are free to choose the images to teach the model, we recommend using images
              on which you have rights of use, whether your own or are under open licenses (e.g.
              creative commons). Be mindful that uploading images of yourself might disclose your
              identity. Yet, the collected images will be only accessed by the researchers and will
              not be used in communications.
            </span>
          </div>
        </div>
      </div>
      <p>
        The study will run for a period of two weeks, during which you will be free to access the
        application whenever you want. You are asked to visit the application regularly, typically
        once a day, so that you can build upon the changes made by others.
      </p>
    </section>
  </section>
  <section class="my-6 text-center">
    {#if data?.user}
      <a class="btn btn-secondary" href="{base}/app/">Go to the app</a>
    {:else}
      <a class="btn btn-secondary" href="{base}/auth/login">Log In</a>
    {/if}
    {#if data?.user?.role === 'admin'}
      <a class="btn btn-primary" href="{base}/auth/signup">Create an Account</a>
    {/if}
    {#if data?.user}
      <button class="btn btn-error btn-outline" on:click={signout}>Sign out</button>
    {/if}
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
