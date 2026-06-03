import Link from 'next/link';
import type { Route } from 'next';

const HANDLES = ['icyJoseph', 'karpathy', 'gaearon', 'yyx990803', 'torvalds', 'rishabkumar7'];

export default function HomePage() {
  return (
    <main className="page">
      <p className="muted">Minimal repro</p>
      <h1>stale cache revalidation error</h1>
      <p className="muted">
        The stale revalidation routes warm a cached success, then make the backing source throw a
        deterministic upstream error after the value becomes stale.
      </p>

      <h2>Primary stale revalidation repro</h2>
      <div className="grid">
        {HANDLES.map(handle => (
          <Link className="card" href={`/stale-revalidate/${handle}`} key={handle}>
            <strong>@{handle}</strong>
            <p className="muted">force-runtime prefetch, cached success, then stale revalidation throws</p>
          </Link>
        ))}
      </div>

      <h2>Stale revalidation control</h2>
      <div className="grid">
        {HANDLES.map(handle => (
          <Link className="card" href={`/stale-revalidate-control/${handle}`} key={handle}>
            <strong>@{handle}</strong>
            <p className="muted">same stale failure path, no force-runtime prefetch export</p>
          </Link>
        ))}
      </div>

      <h2>Cached fallback repro</h2>
      <div className="grid">
        {HANDLES.map(handle => (
          <Link className="card" href={`/stale-revalidate-fallback/${handle}` as Route} key={handle}>
            <strong>@{handle}</strong>
            <p className="muted">same stale path, but a caught error returns fallback data from use cache</p>
          </Link>
        ))}
      </div>

      <h2>Buggy route</h2>
      <div className="grid">
        {HANDLES.map(handle => (
          <Link className="card" href={`/${handle}`} key={handle}>
            <strong>@{handle}</strong>
            <p className="muted">force-runtime prefetch route</p>
          </Link>
        ))}
      </div>

      <h2>Control route</h2>
      <div className="grid">
        {HANDLES.map(handle => (
          <Link className="card" href={`/control/${handle}`} key={handle}>
            <strong>@{handle}</strong>
            <p className="muted">same cached Date payload, no route prefetch export</p>
          </Link>
        ))}
      </div>

      <h2>String payload route</h2>
      <div className="grid">
        {HANDLES.map(handle => (
          <Link className="card" href={`/string/${handle}`} key={handle}>
            <strong>@{handle}</strong>
            <p className="muted">force-runtime prefetch route, cached ISO string payload</p>
          </Link>
        ))}
      </div>

      <h2>Current time bailout route</h2>
      <div className="grid">
        {HANDLES.map(handle => (
          <Link className="card" href={`/current-time/${handle}`} key={handle}>
            <strong>@{handle}</strong>
            <p className="muted">force-runtime prefetch route, Date.now() in render path</p>
          </Link>
        ))}
      </div>

      <h2>Cached current time route</h2>
      <div className="grid">
        {HANDLES.map(handle => (
          <Link className="card" href={`/cached-current-time/${handle}`} key={handle}>
            <strong>@{handle}</strong>
            <p className="muted">same current time value, but inside a use cache function</p>
          </Link>
        ))}
      </div>

      <h2>Flaky cached profile route</h2>
      <div className="grid">
        {HANDLES.map(handle => (
          <Link className="card" href={`/flaky/${handle}`} key={handle}>
            <strong>@{handle}</strong>
            <p className="muted">first cached profile render throws, regenerate warms same tag</p>
          </Link>
        ))}
      </div>

      <h2>Flaky double profile route</h2>
      <div className="grid">
        {HANDLES.map(handle => (
          <Link className="card" href={`/flaky-double/${handle}`} key={handle}>
            <strong>@{handle}</strong>
            <p className="muted">two sibling streamed regions read the same flaky cached profile</p>
          </Link>
        ))}
      </div>

    </main>
  );
}
