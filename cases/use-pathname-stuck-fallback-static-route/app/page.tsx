import { Suspense } from 'react';
import { PathnameDisplay } from './pathname-display';

// Fully static route — no dynamic APIs anywhere.
//
// Both panels below try to display the current pathname using usePathname().
// The only difference: one is wrapped in <Suspense>, the other isn't.
//
// After hard reloading this page:
//   - Panel A (no Suspense): displays "/" correctly.
//   - Panel B (wrapped in Suspense): stuck on the red fallback forever.
//
// Both should display the same thing. The Suspense fallback should be
// replaced on hydration. It isn't.
export default function Page() {
  return (
    <main>
      <h1>Reproduction: usePathname() inside Suspense stuck on static route</h1>
      <p>
        Hard reload this page. Both panels read the pathname with{' '}
        <code>usePathname()</code> from a Client Component. Only the wrapping is different.
      </p>

      <section style={panelStyle}>
        <h2 style={{ marginTop: 0 }}>Panel A — direct (no Suspense)</h2>
        <p>Expected: shows the pathname. Actual: shows the pathname.</p>
        <PathnameDisplay />
      </section>

      <section style={panelStyle}>
        <h2 style={{ marginTop: 0 }}>Panel B — wrapped in &lt;Suspense&gt;</h2>
        <p>Expected: shows the pathname. Actual: stuck on the red fallback.</p>
        <Suspense
          fallback={
            <p style={{ color: 'red', fontWeight: 'bold', margin: 0 }}>
              ❌ FALLBACK — should have been replaced on hydration
            </p>
          }
        >
          <PathnameDisplay />
        </Suspense>
      </section>
    </main>
  );
}

const panelStyle: React.CSSProperties = {
  marginTop: '1.5rem',
  padding: '1rem',
  border: '2px solid #ccc',
  borderRadius: '8px',
};
