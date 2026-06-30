export const prefetch = 'allow-runtime';

export default function Home() {
  return (
    <div>
      <h1>NextBeats-ish</h1>
      <p>
        Two lists of the same 20 items. <strong>Playlists</strong> point at{' '}
        <code>prefetch = &apos;allow-runtime&apos;</code> routes; <strong>Albums</strong> point at
        identical routes <strong>without</strong> it (the control).
      </p>
      <p>Hard-load this page, then click one from each list and compare:</p>
      <ul style={{ lineHeight: 1.6 }}>
        <li>
          <strong>Playlists (allow-runtime):</strong> all 20 fire a runtime prerender on load (watch
          the terminal / Network <code>_rsc=</code>). Click a link whose prefetch is still in-flight
          and there&apos;s no skeleton — the nav waits on the prefetch.
        </li>
        <li>
          <strong>Albums (no allow-runtime):</strong> no runtime fan-out on load. Click and it
          commits to the App Shell immediately (skeleton shows), then streams content.
        </li>
      </ul>
    </div>
  );
}
