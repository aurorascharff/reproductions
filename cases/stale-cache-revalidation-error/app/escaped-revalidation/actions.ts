'use server';

import { revalidateTag, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { armEscapedRevalidation, getEscapedProfile, resetEscapedRevalidation } from './escaped-profile';

function readHandle(formData: FormData) {
  return String(formData.get('handle') ?? '').toLowerCase();
}

function redirectToEscapedRoute(handle: string): never {
  redirect(`/escaped-revalidation/${handle}` as Route);
}

function redirectToNormalError(handle: string): never {
  redirect(`/escaped-revalidation/${handle}?normal-error=1` as Route);
}

function updateEscapedProfileTag(handle: string) {
  updateTag(`escaped-profile-${handle}`);
}

export async function warmEscapedProfile(formData: FormData) {
  const handle = readHandle(formData);
  if (!handle) return;

  resetEscapedRevalidation(handle);
  updateEscapedProfileTag(handle);
  await getEscapedProfile(handle);
  redirectToEscapedRoute(handle);
}

export async function armEscapedProfileFailure(formData: FormData) {
  const handle = readHandle(formData);
  if (!handle) return;

  armEscapedRevalidation(handle);
  revalidateTag(`escaped-profile-${handle}`, 'max');
  redirectToEscapedRoute(handle);
}

export async function throwNormalProfileError(formData: FormData) {
  const handle = readHandle(formData);
  if (!handle) return;

  redirectToNormalError(handle);
}

export async function resetEscapedProfileAction(formData: FormData) {
  const handle = readHandle(formData);
  if (!handle) return;

  resetEscapedRevalidation(handle);
  updateEscapedProfileTag(handle);
  redirectToEscapedRoute(handle);
}
