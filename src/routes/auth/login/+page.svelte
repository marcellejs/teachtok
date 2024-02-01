<script context="module">
  import { store } from '$lib/marcelle/store';
  import { base } from '$app/paths';

  /** @type {import('./[slug]').Load} */
  export async function load() {
    try {
      await store.connect();
      return { status: 302, redirect: `${base}/app/` };
    } catch (error) {
      return {};
    }
  }
</script>

<script lang="ts">
  import { goto } from '$app/navigation';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let err: any;

  function login(e) {
    err = null;
    const formData = new FormData(e.target);
    store
      .login(formData.get('email').toString(), formData.get('password').toString())
      .then(() => store.connect())
      .then(() => goto(`${base}/app/`))
      .catch((error) => {
        err = error;
      });
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<section>
  <h1 class="text-3xl">Log In</h1>
  {#if err}
    <div class="alert alert-error shadow-lg mt-4">
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
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
        >
        <span>Error! {err.message}</span>
      </div>
    </div>
  {/if}
  <form on:submit|preventDefault={login}>
    <div class="form-control w-full">
      <label class="label" for="email">
        <span class="label-text">Enter your email</span>
      </label>
      <input
        type="email"
        name="email"
        placeholder="Type here"
        class="input input-bordered w-full"
      />
    </div>
    <div class="form-control w-full">
      <label class="label" for="password">
        <span class="label-text">Enter your password</span>
      </label>
      <input
        type="password"
        name="password"
        placeholder="Type here"
        class="input input-bordered w-full"
        minlength="8"
      />
    </div>
    <button class="btn bordered btn-primary" type="submit">Log In</button>
  </form>
</section>

<style>
  section {
    max-width: 786px;
    width: 100%;
    margin: 2rem auto;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  form > * {
    padding: 0.2rem;
    margin-top: 1rem;
  }
</style>
