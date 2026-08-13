import Link from 'next/link';

export default function Home() {
  return (
    <div className="landing">
      <header className="site-header">
        <Link className="brand" href="/">
          Acme Docs
        </Link>
        <span className="version">App Router reproduction</span>
      </header>
      <main className="landing-content">
        <p className="eyebrow">Learn</p>
        <h1>Build interfaces from data</h1>
        <p className="lead">
          A small documentation site that reproduces stale route content after
          navigating through a section link.
        </p>
        <Link className="primary-link" href="/docs/rendering-lists">
          Read Rendering Lists
        </Link>
      </main>
    </div>
  );
}
