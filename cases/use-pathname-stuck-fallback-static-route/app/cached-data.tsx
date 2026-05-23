import { cookies } from 'next/headers';

async function getPrivateData() {
  'use cache: private';
  const c = await cookies();
  return { user: c.get('user')?.value ?? 'anon' };
}

export async function CachedData() {
  const data = await getPrivateData();
  return <p>Cached user: {data.user}</p>;
}
