import { Suspense } from 'react';
import { getCachedData } from '../../data';

export default function CachedFnPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h2>Cached data function</h2>
      <p style={{ color: '#888' }}><code>'use cache'</code> on the data function, not the component.</p>
      <Suspense fallback={<p>Loading...</p>}>
        {params.then(({ id }) => (
          <Content id={id} />
        ))}
      </Suspense>
    </div>
  );
}

async function Content({ id }: { id: string }) {
  const data = await getCachedData(id);
  return (
    <div style={{ padding: 16, border: '1px solid #444', borderRadius: 8, marginTop: 12 }}>
      <p>ID: <strong>{data.id}</strong></p>
      <p style={{ color: '#888', fontSize: 12 }}>Timestamp: {data.timestamp}</p>
    </div>
  );
}
