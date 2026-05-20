import { Suspense } from 'react';
import { getData } from '../../data';

export default function CachedPrivatePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h2>Cached private component</h2>
      <p style={{ color: '#888' }}><code>'use cache: private'</code> on the component.</p>
      <Suspense fallback={<p>Loading...</p>}>
        {params.then(({ id }) => (
          <PrivateContent id={id} />
        ))}
      </Suspense>
    </div>
  );
}

async function PrivateContent({ id }: { id: string }) {
  'use cache: private';
  const data = await getData(id);
  return (
    <div style={{ padding: 16, border: '1px solid #444', borderRadius: 8, marginTop: 12 }}>
      <p>ID: <strong>{data.id}</strong></p>
      <p style={{ color: '#888', fontSize: 12 }}>Timestamp: {data.timestamp}</p>
    </div>
  );
}
