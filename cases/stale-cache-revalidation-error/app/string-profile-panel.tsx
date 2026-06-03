import { cacheLife } from 'next/cache';
import { StringPayload } from './string-payload';

type CachedStringProfile = {
  generatedAt: string;
  handle: string;
};

async function getCachedStringProfile(handle: string): Promise<CachedStringProfile> {
  'use cache';
  cacheLife({ expire: 3600, revalidate: 3600, stale: 60 });
  await new Promise(resolve => setTimeout(resolve, 1200));
  return {
    generatedAt: new Date().toISOString(),
    handle,
  };
}

export async function StringProfilePanel(props: { handle: string }) {
  const profile = await getCachedStringProfile(props.handle);
  return <StringPayload generatedAt={profile.generatedAt} handle={profile.handle} />;
}
