import { Suspense } from 'react';
import { getData } from '../../data';

export default function UncachedPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h2>Uncached page</h2>
      <p style={{ color: '#888' }}>No <code>'use cache'</code> — baseline. Revisits should be instant after first compile.</p>
      <Suspense fallback={<p>Loading...</p>}>
        {params.then(({ id }) => (
          <Content id={id} />
        ))}
      </Suspense>
    </div>
  );
}

async function Content({ id }: { id: string }) {
  const data = await getData(id);
  return (
    <div style={{ padding: 16, border: '1px solid #444', borderRadius: 8, marginTop: 12 }}>
      <p>ID: <strong>{data.id}</strong></p>
      <p style={{ color: '#888', fontSize: 12 }}>Timestamp: {data.timestamp}</p>
    </div>
  );
}
