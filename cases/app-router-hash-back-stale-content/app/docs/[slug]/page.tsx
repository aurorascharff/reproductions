import Link from 'next/link';
import {notFound} from 'next/navigation';

const slugs = ['alpha', 'beta'] as const;

function isSlug(value: string): value is (typeof slugs)[number] {
  return slugs.some((slug) => slug === value);
}

export function generateStaticParams() {
  return slugs.map((slug) => ({slug}));
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

  const nextSlug = slug === 'alpha' ? 'beta' : 'alpha';

  return (
    <main>
      <p className="eyebrow">Rendered slug</p>
      <h1 data-testid="rendered-slug">{slug}</h1>
      <p>The heading above must match the slug shown in the browser URL.</p>

      <a href="#details">1. Jump to the details fragment</a>

      <div className="spacer" aria-hidden="true" />

      <section id="details">
        <h2>Details for {slug}</h2>
        <p>The URL now contains the same-page fragment.</p>
        <Link href={`/docs/${nextSlug}`}>
          2. Navigate to the {nextSlug} page
        </Link>
      </section>
    </main>
  );
}
