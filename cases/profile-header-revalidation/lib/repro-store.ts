import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { cookies } from 'next/headers';

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
};

const initialState = (): ReproState => ({
  counters: {},
});

const globalForRepro = globalThis as typeof globalThis & {
  profileHeaderRevalidationRepro?: ReproState;
};

const REPOST_COOKIE = 'profile-header-repro-reposted';
const MUTATION_COOKIE = 'profile-header-repro-mutations';

const delays = {
  header: 900,
  homeFeed: 1200,
  interaction: 650,
  profileFeed: 1500,
};

const users: Record<string, User> = {
  ada: {
    bio: 'Builds tiny social apps to test RSC cache behavior.',
    displayName: 'Ada Lovelace',
    followers: 42,
    handle: 'ada',
  },
  bea: {
    bio: 'Writes posts worth reposting.',
    displayName: 'Bea',
    followers: 7,
    handle: 'bea',
  },
};

const drops: Drop[] = [
  {
    authorHandle: 'bea',
    body: 'This home-feed post is the one Ada can repost.',
    id: 'drop-1',
  },
  {
    authorHandle: 'ada',
    body: 'Ada has one stable profile post so the profile feed has real content before reposting.',
    id: 'drop-2',
  },
];

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

export async function resetReproStore() {
  const store = await cookies();
  store.set(REPOST_COOKIE, '0', { path: '/', sameSite: 'lax' });
  store.set(MUTATION_COOKIE, '0', { path: '/', sameSite: 'lax' });
  globalForRepro.profileHeaderRevalidationRepro = initialState();
}

export async function toggleAdaRepostInStore() {
  await delay(350);

  const store = await cookies();
  const current = readAdaSessionStateFromCookies(store);

  store.set(REPOST_COOKIE, current.repostedByAda ? '0' : '1', { path: '/', sameSite: 'lax' });
  store.set(MUTATION_COOKIE, String(current.mutationCount + 1), { path: '/', sameSite: 'lax' });
}

async function readAdaSessionState() {
  return readAdaSessionStateFromCookies(await cookies());
}

function readAdaSessionStateFromCookies(store: Awaited<ReturnType<typeof cookies>>) {
  return {
    mutationCount: Number(store.get(MUTATION_COOKIE)?.value ?? '0'),
    repostedByAda: store.get(REPOST_COOKIE)?.value === '1',
  };
}

function filledAt() {
  return new Date().toLocaleTimeString('en-US', {
    fractionalSecondDigits: 3,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getUserHeader(handle: string) {
  'use cache';
  cacheTag('users', `user-${handle}`);
  cacheLife('max');

  await delay(delays.header);

  const user = users[handle];
  if (!user) return null;
  return {
    delayMs: delays.header,
    filledAt: filledAt(),
    ...user,
    userDataRecomputes: bump(`query:user:${handle}`),
  };
}

export async function getHomeFeed() {
  'use cache: private';
  cacheTag('feed', 'drop-interactions:ada');
  cacheLife('max');

  await delay(delays.homeFeed);

  const session = await readAdaSessionState();
  return {
    delayMs: delays.homeFeed,
    filledAt: filledAt(),
    feedRecomputes: bump('query:feed'),
    items: drops.map(drop => ({
      ...drop,
      repostedByAda: session.repostedByAda && drop.id === 'drop-1',
    })),
    mutationCount: session.mutationCount,
  };
}

export async function getProfileFeed(handle: string) {
  'use cache: private';
  cacheTag(`user-drops-${handle}`);
  cacheLife('max');

  await delay(delays.profileFeed);

  const session = await readAdaSessionState();
  const authored = drops.filter(drop => drop.authorHandle === handle);
  const reposts = session.repostedByAda && handle === 'ada' ? drops.filter(drop => drop.id === 'drop-1') : [];
  return {
    delayMs: delays.profileFeed,
    filledAt: filledAt(),
    feedItems: [...authored, ...reposts],
    mutationCount: session.mutationCount,
    profileFeedRecomputes: bump(`query:profile-feed:${handle}`),
    repostedByAda: session.repostedByAda,
  };
}

export async function getAdaRepostState() {
  'use cache: private';
  cacheTag('drop-interactions:ada');
  cacheLife('max');

  await delay(delays.interaction);

  const session = await readAdaSessionState();
  return {
    delayMs: delays.interaction,
    filledAt: filledAt(),
    interactionRecomputes: bump('query:drop-interactions:ada'),
    reposted: session.repostedByAda,
  };
}
