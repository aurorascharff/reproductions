'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import {
  getFallbackStaleProfile,
  getStaleProfile,
  makeStaleProfileFail,
  makeStaleProfileSucceed,
  resetStaleProfile,
} from './stale-profile';

function readHandle(formData: FormData) {
  return String(formData.get('handle') ?? '').toLowerCase();
}

function redirectToReproRoute(formData: FormData, handle: string): never {
  const redirectTo = String(formData.get('redirectTo') ?? '');
  if (redirectTo.startsWith('/stale-revalidate-control')) {
    redirect(`/stale-revalidate-control/${handle}`);
  }
  if (redirectTo.startsWith('/stale-revalidate-fallback')) {
    redirect(`/stale-revalidate-fallback/${handle}` as Route);
  }
  redirect(`/stale-revalidate/${handle}`);
}

function updateStaleProfileTags(handle: string) {
  updateTag(`stale-profile-${handle}`);
  updateTag(`fallback-stale-profile-${handle}`);
}

export async function warmStaleProfile(formData: FormData) {
  const handle = readHandle(formData);
  if (!handle) return;

  makeStaleProfileSucceed(handle);
  updateStaleProfileTags(handle);
  await Promise.all([getStaleProfile(handle), getFallbackStaleProfile(handle)]);
  redirectToReproRoute(formData, handle);
}

export async function failNextStaleRevalidation(formData: FormData) {
  const handle = readHandle(formData);
  if (!handle) return;

  makeStaleProfileFail(handle);
  redirectToReproRoute(formData, handle);
}

export async function resetStaleProfileAction(formData: FormData) {
  const handle = readHandle(formData);
  if (!handle) return;

  resetStaleProfile(handle);
  updateStaleProfileTags(handle);
  redirectToReproRoute(formData, handle);
}
