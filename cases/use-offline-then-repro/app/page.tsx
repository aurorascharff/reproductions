export default function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <p>Click the links above, then go offline in DevTools and try navigating.</p>
      <ul style={{ marginTop: 12, lineHeight: 2 }}>
        <li><strong>/async/[id]</strong> — uses <code>await params</code> → shell shows offline ✅</li>
        <li><strong>/then/[id]</strong> — uses <code>params.then()</code> in Suspense → breaks offline ❌</li>
      </ul>
    </div>
  );
}
