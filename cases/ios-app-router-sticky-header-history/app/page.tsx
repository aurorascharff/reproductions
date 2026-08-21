import Link from 'next/link';

export default function Home() {
  return (
    <main className="home">
      <p className="eyebrow">Next.js App Router reproduction</p>
      <h1>Documentation demo</h1>
      <p>Open the documentation section to test Safari history navigation.</p>
      <Link className="button" href="/docs/article">
        Open the article
      </Link>
    </main>
  );
}
