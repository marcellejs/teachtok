<script lang="ts">
  import { base } from '$app/paths';
  import type { User } from '$lib/marcelle/store';

  /** @type {import('./$types').LayoutData} */
  export let data;
  $: user = data.user;

  let pwd: string;
  let pwdCheck: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let err: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let res: any;

  function updatePassword(e: { currentTarget: HTMLFormElement }) {
    const formData = new FormData(e.currentTarget);
    store
      .service('users')
      .patch(user._id, { password: formData.get('password').toString() })
      .then((x) => {
        res = x;
      })
      .catch((error) => {
        err = error;
      });
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<section>
  <h1 class="text-3xl mb-4">Settings</h1>
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
  {#if res}
    <div class="alert alert-success shadow-lg">
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
        >
        <span>Your password was updated!</span>
      </div>
    </div>
  {/if}
  <img src="{base}/animals/{user.avatar}" alt="" style="width:150px; height:150px; padding: 0" />
  <div class="form-control w-full">
    <label class="label" for="name">
      <span class="label-text">name</span>
    </label>
    <input
      disabled
      type="text"
      name="name"
      placeholder="Type here"
      class="input input-bordered w-full"
      value={user.name}
    />
  </div>
  <div class="form-control w-full">
    <label class="label" for="email">
      <span class="label-text">Email</span>
    </label>
    <input
      disabled
      type="email"
      name="email"
      placeholder="Type here"
      class="input input-bordered w-full"
      value={user.email}
    />
  </div>
  <h2 class="text-lg mt-8">Change your password</h2>
  <form on:submit|preventDefault={updatePassword}>
    <div class="form-control w-full">
      <label class="label" for="password">
        <span class="label-text">New password:</span>
      </label>
      <input
        type="password"
        name="password"
        placeholder="Type here"
        class="input input-bordered w-full"
        bind:value={pwd}
        minlength="8"
      />
    </div>
    <div class="form-control w-full">
      <label class="label" for="password-check">
        <span class="label-text">Repeat password:</span>
        {#if pwdCheck && pwd !== pwdCheck}
          <span class="label-text-alt text-error">Passwords do not match</span>
        {/if}
      </label>
      <input
        type="password"
        name="password-check"
        placeholder="Type here"
        class="input input-bordered w-full"
        class:input-error={pwd !== pwdCheck}
        class:input-success={pwd && pwd === pwdCheck}
        bind:value={pwdCheck}
        minlength="8"
      />
    </div>
    <button class="btn bordered btn-primary" type="submit">Update Password</button>
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
