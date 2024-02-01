import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export const ssr = false;

/** @type {import('./$types').LayoutLoad} */
export async function load({ parent }) {
  const parentData = await parent();
  console.log('AFTER PARNET', parentData);
  if (!parentData.user) {
    console.log('REDIRECTING!!');
    redirect(307, `${base}/`);
    // return { code: 307, redirect: `${base}/`}
  }
  return parentData;
}
