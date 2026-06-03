'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { getFlakyProfile, markFlakyProfileReady, resetFlakyProfile } from './flaky-profile';

function readHandle(formData: FormData) {
  return String(formData.get('handle') ?? '').toLowerCase();
}

export async function regenerateFlakyProfile(formData: FormData) {
  const handle = readHandle(formData);
  if (!handle) return;

  markFlakyProfileReady(handle);
  updateTag(`flaky-profile-${handle}`);
  await getFlakyProfile(handle);
  redirect(`/flaky/${handle}`);
}

export async function resetFlakyProfileAction(formData: FormData) {
  const handle = readHandle(formData);
  if (!handle) return;

  resetFlakyProfile(handle);
  updateTag(`flaky-profile-${handle}`);
  redirect(`/flaky/${handle}`);
}
