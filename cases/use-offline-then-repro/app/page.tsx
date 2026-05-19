import Link from 'next/link';

export default function HomePage() {
  const ids = Array.from({ length: 40 }, (_, i) => `item-${i + 1}`);
  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>Offline navigation repro</h1>
      <ol style={{ marginBottom: 24, color: '#888', lineHeight: 2 }}>
        <li>Wait for all visible links to prefetch (watch Network tab — requests stop)</li>
        <li>Go offline in DevTools → Network → Offline</li>
        <li>Scroll down to links that were NOT visible (not prefetched)</li>
        <li>Click one from each column at the same row and compare</li>
      </ol>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <h2 style={{ marginBottom: 12 }}>Async wrapper</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {ids.map(id => (
              <li key={id} style={{ marginBottom: 6 }}>
                <Link href={`/async/${id}`} style={{ color: '#60a5fa', fontSize: 14 }}>
                  /async/{id}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 style={{ marginBottom: 12 }}>params.then()</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {ids.map(id => (
              <li key={id} style={{ marginBottom: 6 }}>
                <Link href={`/then/${id}`} style={{ color: '#f59e0b', fontSize: 14 }}>
                  /then/{id}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
