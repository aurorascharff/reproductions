import { Suspense } from 'react';
import { SlowContent } from '../../slow-content';

export default async function AsyncPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <h2>Async page — <code>await params</code></h2>
      <Suspense fallback={<p style={{ color: '#888' }}>Loading...</p>}>
        <SlowContent id={id} />
      </Suspense>
    </div>
  );
}
