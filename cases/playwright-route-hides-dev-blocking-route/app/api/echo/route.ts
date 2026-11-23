import { headers } from 'next/headers';

export async function GET() {
  const h = await headers();
  return Response.json({ cacheControl: h.get('cache-control'), pragma: h.get('pragma') });
}
