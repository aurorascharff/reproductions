'use server';

import { updateTag } from 'next/cache';

export async function actionWithCurrentTime() {
  const thisYear = new Date().getUTCFullYear();
  updateTag(`year-${thisYear}`);
}

