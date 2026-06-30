export const prefetch = 'allow-runtime';

export default function Home() {
  return (
    <div>
      <h1>NextBeats-ish</h1>
      <p>
        Hard-load this page, then click a playlist near the <strong>bottom</strong> of the sidebar
        (e.g. <em>Power Ballads</em> or <em>World Grooves</em>). Watch how long its tracks take to
        appear, and watch the terminal — 20 runtime prerenders fire on load, before you click
        anything.
      </p>
      <p style={{ color: '#666' }}>
        The sidebar header shows whether eager prefetch is on. Rebuild with{' '}
        <code>EAGER=0 pnpm build &amp;&amp; pnpm start</code> to feel the same click without the
        storm.
      </p>
    </div>
  );
}
