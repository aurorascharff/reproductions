import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="page-scroll">
      <div className="landing">
        <p className="eyebrow">Minimal reproduction</p>
        <h1>Back loses an evicted route’s nested scroll position</h1>
        <p className="lead">
          Both examples use ordinary Next.js Links and the same route-owned scroll container. The only
          difference is whether the list remains inside Activity’s three-route retention window.
        </p>

        <div className="comparison-grid">
          <Link className="comparison-card control" href="/retained-list">
            <span className="badge control-badge">Retained</span>
            <h2>Back immediately</h2>
            <p>
              Open one detail route and go Back. Activity retains the list and its scroll position.
            </p>
          </Link>

          <Link className="comparison-card failure" href="/evicted-list">
            <span className="badge failure-badge">Evicted</span>
            <h2>Visit four routes first</h2>
            <p>
              Advance through four distinct routes, then return through history. The list returns at the top.
            </p>
          </Link>
        </div>

        <section className="summary-card">
          <h2>What this isolates</h2>
          <ul>
            <li>The retained path proves the nested scroller works while its Activity remains cached.</li>
            <li>The scroll container belongs to the route, not the shared layout.</li>
            <li>There is no FastLink, data fetching, Suspense, animation, or custom restoration code.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
