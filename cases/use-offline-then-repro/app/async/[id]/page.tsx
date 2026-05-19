import { Suspense } from 'react';
import { SlowContent } from '../../slow-content';

export default function AsyncPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h2>Async page — async wrapper component</h2>
      <Suspense fallback={<p style={{ color: '#888' }}>Loading...</p>}>
        <AsyncContent params={params} />
      </Suspense>
    </div>
  );
}

async function AsyncContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SlowContent id={id} />;
}
