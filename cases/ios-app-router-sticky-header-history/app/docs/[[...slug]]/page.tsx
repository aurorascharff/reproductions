import Link from 'next/link';
import {notFound} from 'next/navigation';

export function generateStaticParams() {
  return [{slug: []}, {slug: ['article']}];
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{slug?: string[]}>;
}) {
  const {slug = []} = await params;
  const pathname = slug.join('/');

  if (pathname === '') {
    return <Overview />;
  }
  if (pathname === 'article') {
    return <Article />;
  }
  notFound();
}

function Overview() {
  return (
    <main className="article">
      <p className="eyebrow">Overview</p>
      <h1>Learn the App Router</h1>
      <p className="lead">
        This page and the article share the sticky header from the docs layout.
      </p>
      <Link className="button" href="/docs/article">
        Read the article
      </Link>
      <LongContent label="Overview" />
    </main>
  );
}

function Article() {
  return (
    <main className="article">
      <p className="eyebrow">Article</p>
      <h1>Rendering an interface</h1>
      <p className="lead">
        Use the link below, then swipe or press Back and Forward in iOS Safari.
      </p>
      <Link className="button" href="/docs">
        Back to the overview
      </Link>
      <LongContent label="Article" />
    </main>
  );
}

function LongContent({label}: {label: string}) {
  return Array.from({length: 8}, (_, index) => (
    <section key={index}>
      <h2>
        {label} section {index + 1}
      </h2>
      <p>
        The sticky header should remain painted throughout browser history
        navigation without requiring a scroll to make it reappear.
      </p>
    </section>
  ));
}
