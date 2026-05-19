import Link from 'next/link';

export default function HomePage() {
  const ids = Array.from({ length: 40 }, (_, i) => `item-${i + 1}`);
  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>Offline + force-runtime repro</h1>
      <ol style={{ marginBottom: 24, color: '#888', lineHeight: 2 }}>
        <li>Wait for visible links to prefetch (watch Network tab)</li>
        <li>Go offline in DevTools</li>
        <li>Scroll down and click a link from each column that was NOT visible</li>
      </ol>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <h2 style={{ marginBottom: 12, color: '#f59e0b' }}>With force-runtime</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {ids.map(id => (
              <li key={id} style={{ marginBottom: 6 }}>
                <Link href={`/force/${id}`} style={{ color: '#f59e0b', fontSize: 14 }}>
                  /force/{id}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 style={{ marginBottom: 12, color: '#60a5fa' }}>Without force-runtime</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {ids.map(id => (
              <li key={id} style={{ marginBottom: 6 }}>
                <Link href={`/normal/${id}`} style={{ color: '#60a5fa', fontSize: 14 }}>
                  /normal/{id}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
