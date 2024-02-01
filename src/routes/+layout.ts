import type { User } from '$lib/marcelle';

export const ssr = false;

export async function load() {
  console.log('HERE HERE');
  try {
    console.log('YA Pipoutchik');
    const { store } = await import('$lib/marcelle/store');
    console.log('YA Storchik', store);
    const user = (await store.connect()) as User;
    return { user };
  } catch (error) {
    console.log('YOYOYO', error);
    return { user: null };
  }
}
