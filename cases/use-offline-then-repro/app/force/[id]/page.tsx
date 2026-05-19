import { Suspense } from 'react';
import { SlowContent } from '../../slow-content';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `With force-runtime — ${id}` };
}

export const unstable_prefetch = 'force-runtime';

export default function ForcePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h2>With <code>force-runtime</code></h2>
      <Suspense fallback={<p style={{ color: '#888' }}>Loading...</p>}>
        {params.then(({ id }) => (
          <SlowContent id={id} />
        ))}
      </Suspense>
    </div>
  );
}
