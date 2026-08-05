'use server';

import { updateTag } from 'next/cache';
import { resetReproStore, toggleAdaRepostInStore } from '../../lib/repro-store';

export async function toggleAdaRepost() {
  toggleAdaRepostInStore();

  updateTag('feed');
  updateTag('user-drops-ada');
  updateTag('drop-interactions:ada');
}

export async function resetRepro() {
  resetReproStore();

  updateTag('feed');
  updateTag('user-drops-ada');
  updateTag('drop-interactions:ada');
  updateTag('users');
  updateTag('user-ada');
}
