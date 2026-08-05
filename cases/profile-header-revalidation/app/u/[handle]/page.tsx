import Link from 'next/link';
import { Suspense } from 'react';
import { ResetButton } from '../../../features/drop/repost-button';
import { ProfileFeed, ProfileFeedSkeleton } from '../../../features/user/profile-feed';
import { ProfileHeader, ProfileHeaderSkeleton } from '../../../features/user/profile-header';

export default function ProfilePage({ params }: PageProps<'/u/[handle]'>) {
  return (
    <main className="page">
      <nav className="nav">
        <Link href="/">Home</Link>
        <Link href="/u/ada">Ada profile</Link>
        <ResetButton />
      </nav>
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        {params.then(({ handle }) => (
          <ProfileHeader handle={handle} />
        ))}
      </Suspense>
      <Suspense fallback={<ProfileFeedSkeleton />}>
        {params.then(({ handle }) => (
          <ProfileFeed handle={handle} />
        ))}
      </Suspense>
    </main>
  );
}
