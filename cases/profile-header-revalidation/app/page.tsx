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
      <header className="hero">
        <p className="eyebrow">cache components repro</p>
        <h1>Profile header revalidation repro</h1>
        <p className="muted">
          Repost from home, then navigate back to Ada. The mutation invalidates the feed and interaction tags, but it
          deliberately does not update Ada&apos;s public user/header tags.
        </p>
      </header>
      <Suspense fallback={<HomeFeedSkeleton />}>
        <HomeFeed />
      </Suspense>
    </main>
  );
}
