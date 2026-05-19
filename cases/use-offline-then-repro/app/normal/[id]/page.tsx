import { Suspense } from 'react';
import { SlowContent } from '../../slow-content';

export default function NormalPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h2>Without <code>force-runtime</code></h2>
      <Suspense fallback={<p style={{ color: '#888' }}>Loading...</p>}>
        {params.then(({ id }) => (
          <SlowContent id={id} />
        ))}
      </Suspense>
    </div>
  );
}
