import type { User } from '$lib/marcelle';

export const ssr = false;

export async function load() {
  try {
    const { store } = await import('$lib/marcelle/store');
    const user = (await store.connect()) as User;
    return { user };
  } catch (error) {
    return { user: null };
  }
}
