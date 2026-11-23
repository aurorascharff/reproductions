import { connection } from 'next/server';

// Uncached, request-time work with no <Suspense> above it: the mistake dev should point out.
export default async function Page() {
  await connection();
  return <h1>Rendered at {new Date().toISOString()}</h1>;
}
