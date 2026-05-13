import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>EmptyGenerateStaticParamsError repro</h1>
      <p>
        Visit <Link href="/items/anything">/items/anything</Link> to trigger the
        error.
      </p>
    </main>
  );
}
