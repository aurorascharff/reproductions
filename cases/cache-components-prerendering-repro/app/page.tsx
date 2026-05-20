import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Cache Components Prerendering Repro</h1>
      <p style={{ color: '#888', marginBottom: 16 }}>
        Run with <code>next dev</code>. Navigate between pages and watch the devtools overlay.
      </p>
      <p style={{ color: '#888', marginBottom: 24 }}>
        On subsequent navigations to the same page, "Prerendering" should NOT appear if the cache is warm.
        The bug: with <code>'use cache'</code>, every navigation triggers "Prerendering" even on revisits.
      </p>
      <h2>Routes</h2>
      <ul style={{ lineHeight: 2.5 }}>
        <li>
          <Link href="/uncached/1" style={{ color: '#60a5fa' }}>/uncached/1</Link> — no cache directives (baseline)
        </li>
        <li>
          <Link href="/uncached/2" style={{ color: '#60a5fa' }}>/uncached/2</Link> — no cache directives (different param)
        </li>
        <li>
          <Link href="/cached/1" style={{ color: '#f59e0b' }}>/cached/1</Link> — <code>'use cache'</code> on component
        </li>
        <li>
          <Link href="/cached/2" style={{ color: '#f59e0b' }}>/cached/2</Link> — <code>'use cache'</code> on component (different param)
        </li>
        <li>
          <Link href="/cached-fn/1" style={{ color: '#10b981' }}>/cached-fn/1</Link> — <code>'use cache'</code> on data function
        </li>
        <li>
          <Link href="/cached-fn/2" style={{ color: '#10b981' }}>/cached-fn/2</Link> — <code>'use cache'</code> on data function (different param)
        </li>
        <li>
          <Link href="/cached-private/1" style={{ color: '#a78bfa' }}>/cached-private/1</Link> — <code>'use cache: private'</code>
        </li>
        <li>
          <Link href="/cached-private/2" style={{ color: '#a78bfa' }}>/cached-private/2</Link> — <code>'use cache: private'</code> (different param)
        </li>
      </ul>
    </div>
  );
}
