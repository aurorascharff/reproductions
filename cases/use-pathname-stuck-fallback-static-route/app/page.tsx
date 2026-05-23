import { cookies } from 'next/headers';
import { Suspense } from 'react';

// Mimic the real-app home page: force-runtime prefetch + dynamic content.
export const unstable_prefetch = 'force-runtime';

async function DynamicGreeting() {
  const c = await cookies();
  const name = c.get('name')?.value ?? 'world';
  return <p>Hello, {name}!</p>;
}

export default function Page() {
  return (
    <div>
      <h1>Home (/)</h1>
      <p>Hard reload and check the sidebar.</p>
      <p>
        <strong>Expected:</strong> Home shows "✅ ACTIVE"
      </p>
      <p>
        <strong>Bug:</strong> Home stuck on "❌ (fallback)" forever
      </p>
      <Suspense fallback={<p>Loading greeting...</p>}>
        <DynamicGreeting />
      </Suspense>
    </div>
  );
}
