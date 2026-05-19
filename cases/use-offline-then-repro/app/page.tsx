import Link from 'next/link';

export default function HomePage() {
  const ids = Array.from({ length: 50 }, (_, i) => `item-${i + 1}`);
  return (
    <div>
      <h1>Home</h1>
      <p>Scroll down to find links that haven't been prefetched, then go offline and click one.</p>
      <ul style={{ marginTop: 12, lineHeight: 2 }}>
        <li><strong>/async/[id]</strong> — uses async wrapper component inside Suspense</li>
        <li><strong>/then/[id]</strong> — uses <code>params.then()</code> inside Suspense</li>
      </ul>
      <h2 style={{ marginTop: 24 }}>Async links</h2>
      <ul style={{ lineHeight: 2.5 }}>
        {ids.map(id => (
          <li key={id}>
            <Link href={`/async/${id}`} style={{ color: '#60a5fa' }}>
              /async/{id}
            </Link>
          </li>
        ))}
      </ul>
      <h2 style={{ marginTop: 24 }}>Then links</h2>
      <ul style={{ lineHeight: 2.5 }}>
        {ids.map(id => (
          <li key={id}>
            <Link href={`/then/${id}`} style={{ color: '#f59e0b' }}>
              /then/{id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
