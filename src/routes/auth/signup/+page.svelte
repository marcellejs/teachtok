<script context="module">
  // import { store, type User } from '$lib/marcelle/store';

  /** @type {import('./[slug]').Load} */
  export async function load() {
    return {};
    // // TODO: uncomment the next line for the final version, and update backend config
    // try {
    //   const user = await store.connect();
    //   if (user.role !== 'Admin') {
    //     return { status: 302, redirect: '/' };
    //   }
    //   return {};
    // } catch (error) {
    //   return { status: 302, redirect: '/' };
    // }
  }
</script>

<script lang="ts">
  import { base } from '$app/paths';

  // import html2canvas from 'html2canvas';
  import { store, type User } from '$lib/marcelle/store';
  import { petName } from '$lib/names';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let err: any;
  let res: User | null;
  let avatarElt: HTMLImageElement;

  let name: string;
  let avatar: string;

  function generateName() {
    name = petName();
    avatar = name.split(' ').slice(1).join('-').toLowerCase() + '.png';
  }

  generateName();

  async function signup(e: { currentTarget: HTMLFormElement }) {
    err = null;
    res = null;
    const formData = new FormData(e.currentTarget);
    // console.log('Here...');
    // const pic = await html2canvas(avatarElt).then((canvas: HTMLCanvasElement) =>
    //   canvas.toDataURL('image/jpeg'),
    // );
    // console.log('pic', pic);
    store
      .service('users')
      .create({
        email: (formData.get('email') || '').toString(),
        name,
        avatar,
        password: (formData.get('password') || '').toString(),
      })
      .then((user: unknown) => {
        res = user as User;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        // eslint-disable-next-line no-console
        console.log(error);
        err = error;
      });
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<section>
  <h1 class="text-3xl">Create a new User</h1>
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
        <span>User {res.email} was successfully created!</span>
      </div>
      <div class="flex-none">
        <button class="btn btn-sm" on:click={() => location.reload()}>ok (reload)</button>
      </div>
    </div>
  {/if}
  <form on:submit|preventDefault={signup}>
    <img
      bind:this={avatarElt}
      style="width:150px; height:150px; padding: 0"
      src="{base}/animals/{avatar}"
      alt={name}
    />
    {base}
    <div class="form-control w-full">
      <label class="label" for="pseudo">
        <span class="label-text">Name</span>
      </label>
      <label class="input-group w-full">
        <input type="text" name="pseudo" class="input input-bordered" disabled value={name} />
        <span
          ><button type="button" on:click={generateName}
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clip-rule="evenodd"
              />
            </svg></button
          ></span
        >
      </label>
    </div>
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
      />
    </div>
    <button class="btn bordered btn-primary" type="submit">Signup</button>
  </form>
</section>

<footer>Icons created by Freepik - Flaticon</footer>

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
