export default function HomePage() {
  return (
    <div>
      <h1>use cache: private — "Prerendering" on every revisit</h1>
      <p style={{ color: '#888', marginBottom: 16 }}>
        Run with <code>next dev</code>. Click between routes and watch the devtools overlay.
      </p>
      <ol style={{ color: '#888', lineHeight: 2 }}>
        <li>Click <strong>Uncached /1</strong> — compiles on first visit, instant on revisit ✅</li>
        <li>Click <strong>Private /1</strong> — shows "Prerendering" on every revisit ❌</li>
      </ol>
    </div>
  );
}
