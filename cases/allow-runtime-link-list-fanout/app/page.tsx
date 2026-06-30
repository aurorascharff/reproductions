export const prefetch = 'allow-runtime';

export default function Home() {
  return (
    <div>
      <h1>NextBeats-ish</h1>
      <p>
        Hard-load this page, then click any playlist in the sidebar. The click is{' '}
        <strong>entirely unresponsive</strong> — no spinner, no skeleton, the URL doesn&apos;t even
        change — for several seconds, then the page swaps in all at once.
      </p>
      <p style={{ color: '#666' }}>
        The route is a blocking route (<code>instant = false</code>, no Suspense fallback), so the
        navigation is held on the old page until its render resolves — and that render is stuck
        behind the 20 runtime prerenders the sidebar fired on load.
      </p>
      <p style={{ color: '#666' }}>
        Rebuild with <code>EAGER=0 pnpm build &amp;&amp; pnpm start</code> to feel the same click
        without the storm.
      </p>
    </div>
  );
}
