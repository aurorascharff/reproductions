import { getProfileFeed } from '../../lib/repro-store';

export async function ProfileFeed({ handle }: { handle: string }) {
  const feed = await getProfileFeed(handle);

  return (
    <section className="card" data-testid="profile-feed">
      <h2>Profile feed</h2>
      <p className="muted">
        Profile feed recomputes: <strong>{feed.profileFeedRecomputes}</strong> | Mutations:{' '}
        <strong>{feed.mutationCount}</strong> | Ada reposted: <strong>{String(feed.repostedByAda)}</strong>
      </p>
      {feed.feedItems.length === 0 ? (
        <p>No profile items.</p>
      ) : (
        feed.feedItems.map(item => (
          <article className="card" key={item.id}>
            <strong>@{item.authorHandle}</strong>
            <p>{item.body}</p>
          </article>
        ))
      )}
    </section>
  );
}

export function ProfileFeedSkeleton() {
  return (
    <section className="card" aria-label="Loading profile feed">
      <span className="skeleton" style={{ width: 110 }} />
      <div style={{ height: 12 }} />
      <span className="skeleton" style={{ width: '80%' }} />
    </section>
  );
}
