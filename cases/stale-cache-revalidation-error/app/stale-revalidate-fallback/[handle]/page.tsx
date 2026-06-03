import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Route } from 'next';

type PageProps = {
  params: Promise<{ handle: string }>;
};

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<main className="page">Redirecting...</main>}>
      <RedirectToPrimaryRepro params={params} />
    </Suspense>
  );
}

async function RedirectToPrimaryRepro({ params }: PageProps) {
  const { handle } = await params;
  redirect(`/escaped-revalidation/${handle}` as Route);
  return null;
}
