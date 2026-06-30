export const prefetch = 'allow-runtime';

export default function Home() {
  return (
    <div>
      <h1>NextBeats-ish</h1>
      <p>
        Hard-load this page, then click a playlist near the <strong>top</strong> of the sidebar
        (e.g. <em>Morning Coffee</em> or <em>Deep Focus</em>). Watch how long its tracks take to
        appear — the shell shows instantly, but the content lags for several seconds.
      </p>
      <p style={{ color: '#666' }}>
        The top links are slowest because the router prefetches the list <em>bottom-up</em>, so the
        top ones are last in line for the single connection — stuck behind the 20 runtime prerenders
        that fired on load, before you clicked anything.
      </p>
      <p style={{ color: '#666' }}>
        Rebuild with <code>EAGER=0 pnpm build &amp;&amp; pnpm start</code> to feel the same click
        without the storm.
      </p>
    </div>
  );
}
