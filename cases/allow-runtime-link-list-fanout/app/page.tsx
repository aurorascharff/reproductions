export const prefetch = 'allow-runtime';

export default function Home() {
  return (
    <div>
      <h1>NextBeats-ish</h1>
      <p>
        Hard-load this page, then click a playlist right away. The <strong>first click</strong> has
        a brief delay while its runtime fill clears the queue behind the other prefetches — all 20
        links runtime-prefetch on load (watch the terminal / Network <code>_rsc=</code>). Warm
        clicks are instant.
      </p>
      <p style={{ color: '#666' }}>
        <code>prefetch = &apos;allow-runtime&apos;</code> routes behind Suspense fallbacks, with{' '}
        <code>&apos;use cache&apos;</code> reads that have data latency. No artificial limits.
      </p>
    </div>
  );
}
