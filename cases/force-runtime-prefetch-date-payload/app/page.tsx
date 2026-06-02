import Link from 'next/link';

const HANDLES = ['icyJoseph', 'karpathy', 'gaearon', 'yyx990803', 'torvalds', 'rishabkumar7'];

export default function HomePage() {
  return (
    <main className="page">
      <p className="muted">Minimal repro</p>
      <h1>force-runtime prefetch + cached Date payload</h1>
      <p className="muted">
        The first grid links to a dynamic route that exports{' '}
        <span className="mono">unstable_prefetch = &apos;force-runtime&apos;</span>. The route reads cached server data
        and sends a real <span className="mono">Date</span> object to a Client Component.
      </p>

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
    </main>
  );
}
