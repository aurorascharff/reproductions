import Link from 'next/link';
import { Suspense } from 'react';
import { HomeFeed, HomeFeedSkeleton } from '../features/drop/home-feed';
import { ResetButton } from '../features/drop/repost-button';

export default function HomePage() {
  return (
    <main className="page">
      <nav className="nav">
        <Link href="/">Home</Link>
        <Link href="/u/ada">Ada profile</Link>
        <ResetButton />
      </nav>
      <h1>Profile header revalidation repro</h1>
      <p className="muted">
        Repost from home, then navigate back to Ada. The repost action invalidates the home feed, Ada&apos;s profile
        feed, and Ada&apos;s drop interactions, but not Ada&apos;s user/header tags.
      </p>
      <Suspense fallback={<HomeFeedSkeleton />}>
        <HomeFeed />
      </Suspense>
    </main>
  );
}
