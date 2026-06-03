import { cacheLife } from 'next/cache';
import { DatePayload } from './date-payload';

type CachedProfile = {
  generatedAt: Date;
  handle: string;
};

async function getCachedProfile(handle: string): Promise<CachedProfile> {
  'use cache';
  cacheLife({ expire: 3600, revalidate: 3600, stale: 60 });
  await new Promise(resolve => setTimeout(resolve, 1200));
  return {
    generatedAt: new Date(),
    handle,
  };
}

export async function ProfilePanel(props: { handle: string }) {
  const profile = await getCachedProfile(props.handle);
  return <DatePayload generatedAt={profile.generatedAt} handle={profile.handle} />;
}
