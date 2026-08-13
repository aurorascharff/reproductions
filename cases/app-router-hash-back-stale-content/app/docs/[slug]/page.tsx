import Link from 'next/link';
import {notFound} from 'next/navigation';

const articles = {
  'rendering-lists': {
    title: 'Rendering Lists',
    description:
      'Use JavaScript array methods to transform collections of data into components.',
    sections: [
      {
        id: 'rendering-data-from-arrays',
        title: 'Rendering data from arrays',
        body: 'Interfaces often repeat the same component with different data. Mapping over an array keeps the data separate from the markup that presents it.',
      },
      {
        id: 'keeping-list-items-in-order-with-key',
        title: 'Keeping list items in order with key',
        body: 'Each item needs a stable key so the renderer can match it with the corresponding item from the previous render, even when the list changes.',
      },
      {
        id: 'where-to-get-your-key',
        title: 'Where to get your key',
        body: 'Data from a database can use its database key. Locally generated data should receive a stable identifier when it is created.',
      },
    ],
    next: {slug: 'managing-state', title: 'Managing State'},
  },
  'managing-state': {
    title: 'Managing State',
    description:
      'Structure state so components remain predictable as an interface grows.',
    sections: [
      {
        id: 'choosing-the-state-structure',
        title: 'Choosing the state structure',
        body: 'Keep state minimal and avoid values that can be calculated from existing props or state during rendering.',
      },
      {
        id: 'sharing-state-between-components',
        title: 'Sharing state between components',
        body: 'When two components need to coordinate, move their shared state to the closest common parent and pass it down.',
      },
      {
        id: 'preserving-and-resetting-state',
        title: 'Preserving and resetting state',
        body: 'State is associated with a component position in the render tree. Changing that position or its key resets the state.',
      },
    ],
    next: {slug: 'rendering-lists', title: 'Rendering Lists'},
  },
} as const;

type Slug = keyof typeof articles;

function isSlug(value: string): value is Slug {
  return value in articles;
}

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({slug}));
}

export default async function Page({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;

  if (!isSlug(slug)) {
    notFound();
  }

  const article = articles[slug];

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/">
          Acme Docs
        </Link>
        <span className="version">App Router reproduction</span>
      </header>

      <div className="docs-layout">
        <aside className="sidebar">
          <p className="nav-label">Learn</p>
          <nav aria-label="Documentation">
            <Link
              href="/docs/rendering-lists"
              aria-current={slug === 'rendering-lists' ? 'page' : undefined}>
              Rendering Lists
            </Link>
            <Link
              href="/docs/managing-state"
              aria-current={slug === 'managing-state' ? 'page' : undefined}>
              Managing State
            </Link>
          </nav>
        </aside>

        <main className="article-column">
          <div className="breadcrumbs">
            <Link href="/">Docs</Link>
            <span aria-hidden="true">/</span>
            <span>Learn</span>
          </div>

          <aside className="test-flow" aria-labelledby="test-flow-title">
            <p className="test-label">Reproduction flow</p>
            <h2 id="test-flow-title">Test browser Back from a real section link</h2>
            <ol>
              <li>
                In <strong>On this page</strong>, click the second section.
              </li>
              <li>
                At the bottom of the article, open the <strong>Next article</strong>.
              </li>
              <li>Press the browser Back button once.</li>
            </ol>
            <p>
              Expected: this article returns. Bug: its URL returns, but the next
              article can remain on screen.
            </p>
          </aside>

          <article>
            <p className="eyebrow">Learn</p>
            <h1 data-testid="rendered-article">{article.title}</h1>
            <p className="lead">{article.description}</p>

            {article.sections.map((section, index) => (
              <section id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                {slug === 'rendering-lists' && index === 0 ? (
                  <pre>
                    <code>{`const items = people.map(person => (\n  <li key={person.id}>{person.name}</li>\n));`}</code>
                  </pre>
                ) : null}
              </section>
            ))}
          </article>

          <Link className="next-article" href={`/docs/${article.next.slug}`}>
            <span>Next article</span>
            <strong>{article.next.title}</strong>
          </Link>
        </main>

        <aside className="toc">
          <p className="nav-label">On this page</p>
          <nav aria-label="On this page">
            {article.sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                {section.title}
              </a>
            ))}
          </nav>
          <p className="anchor-note">
            These are ordinary HTML section links:{' '}
            <code>{'<a href="#section">'}</code>
          </p>
        </aside>
      </div>
    </div>
  );
}
