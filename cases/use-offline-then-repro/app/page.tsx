import Link from 'next/link';

export default function HomePage() {
  const ids = Array.from({ length: 20 }, (_, i) => `item-${i + 1}`);
  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>Offline navigation repro</h1>
      <p style={{ marginBottom: 24, color: '#888' }}>Go offline, then click a link below the fold.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <h2 style={{ marginBottom: 12 }}>Async wrapper</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {ids.map(id => (
              <li key={id} style={{ marginBottom: 16 }}>
                <Link href={`/async/${id}`} style={{ color: '#60a5fa', fontSize: 18 }}>
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
              <li key={id} style={{ marginBottom: 16 }}>
                <Link href={`/then/${id}`} style={{ color: '#f59e0b', fontSize: 18 }}>
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
