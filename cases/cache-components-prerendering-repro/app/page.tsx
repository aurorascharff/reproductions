export default function HomePage() {
  return (
    <div>
      <h1>Cache components: Suspense fallbacks don&apos;t show in dev</h1>
      <p style={{ color: "#888", marginBottom: 16 }}>
        Run with <code>next dev</code>. Click between routes and watch the
        devtools overlay.
      </p>
      <ol style={{ color: "#888", lineHeight: 2 }}>
        <li>
          Click <strong>Uncached /1</strong> — shows Suspense fallback, then
          content ✅
        </li>
        <li>
          Click <strong>Cached /1</strong> — blocks first time with
          &quot;Prerendering&quot;, no skeleton ❌
        </li>
        <li>
          Click <strong>Private /1</strong> — blocks with
          &quot;Prerendering&quot; every revisit, no fallback ❌
        </li>
      </ol>
      <p style={{ color: "#888", maxWidth: 600, marginTop: 16 }}>
        Suspense fallbacks should show while the cached component resolves, but
        instead you see &quot;Prerendering&quot; blocking the page. With{" "}
        <code>&apos;use cache: private&apos;</code> it re-triggers on every
        navigation.
      </p>
    </div>
  );
}
