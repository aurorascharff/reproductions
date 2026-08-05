import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

type User = {
  bio: string;
  displayName: string;
  followers: number;
  handle: string;
};

type Drop = {
  authorHandle: string;
  body: string;
  id: string;
};

type ReproState = {
  counters: Record<string, number>;
  drops: Drop[];
  mutationCount: number;
  repostedByAda: boolean;
  users: Record<string, User>;
};

const initialState = (): ReproState => ({
  counters: {},
  drops: [
    {
      authorHandle: 'bea',
      body: 'This is the post Ada can repost from the home feed.',
      id: 'drop-1',
    },
  ],
  mutationCount: 0,
  repostedByAda: false,
  users: {
    ada: {
      bio: 'Builds tiny social apps to test RSC cache behavior.',
      displayName: 'Ada',
      followers: 42,
      handle: 'ada',
    },
    bea: {
      bio: 'Writes posts worth reposting.',
      displayName: 'Bea',
      followers: 7,
      handle: 'bea',
    },
  },
});

const globalForRepro = globalThis as typeof globalThis & {
  profileHeaderRevalidationRepro?: ReproState;
};

function state() {
  globalForRepro.profileHeaderRevalidationRepro ??= initialState();
  return globalForRepro.profileHeaderRevalidationRepro;
}

function bump(key: string) {
  const current = state().counters[key] ?? 0;
  state().counters[key] = current + 1;
  return state().counters[key];
}

export function bumpProfileHeaderRender(handle: string) {
  return bump(`render:profile-header:${handle}`);
}

export function resetReproStore() {
  globalForRepro.profileHeaderRevalidationRepro = initialState();
}

export function toggleAdaRepostInStore() {
  const current = state();
  current.repostedByAda = !current.repostedByAda;
  current.mutationCount += 1;
}

export async function getUserHeader(handle: string) {
  'use cache';
  cacheTag('users', `user-${handle}`);
  cacheLife('max');

  const user = state().users[handle];
  if (!user) return null;
  return {
    ...user,
    userDataRecomputes: bump(`query:user:${handle}`),
  };
}

export async function getHomeFeed() {
  'use cache';
  cacheTag('feed');
  cacheLife('max');

  const current = state();
  return {
    feedRecomputes: bump('query:feed'),
    items: current.drops.map(drop => ({
      ...drop,
      repostedByAda: current.repostedByAda,
    })),
    mutationCount: current.mutationCount,
  };
}

export async function getProfileFeed(handle: string) {
  'use cache';
  cacheTag(`user-drops-${handle}`);
  cacheLife('max');

  const current = state();
  const authored = current.drops.filter(drop => drop.authorHandle === handle);
  const reposts = current.repostedByAda && handle === 'ada' ? current.drops : [];
  return {
    feedItems: [...authored, ...reposts],
    mutationCount: current.mutationCount,
    profileFeedRecomputes: bump(`query:profile-feed:${handle}`),
    repostedByAda: current.repostedByAda,
  };
}

export async function getAdaRepostState() {
  'use cache';
  cacheTag('drop-interactions:ada');
  cacheLife('max');

  return {
    interactionRecomputes: bump('query:drop-interactions:ada'),
    reposted: state().repostedByAda,
  };
}
