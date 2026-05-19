import { Suspense } from 'react';
import { SlowContent } from '../../slow-content';

export default function ThenPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h2>Then page — <code>params.then()</code></h2>
      <Suspense fallback={<p style={{ color: '#888' }}>Loading...</p>}>
        {params.then(({ id }) => (
          <SlowContent id={id} />
        ))}
      </Suspense>
    </div>
  );
}
