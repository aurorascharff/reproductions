import { getProfileFeed } from '../../lib/repro-store';

export async function ProfileFeed({ handle }: { handle: string }) {
  const feed = await getProfileFeed(handle);

  return (
    <section className="card" data-testid="profile-feed">
      <p className="eyebrow">private cached profile feed</p>
      <h2>@{handle} profile feed</h2>
      <p className="muted">
        Tagged as <code>user-drops-{handle}</code>. Repost invalidates this cache, but not the profile header.
      </p>
      <div className="metric-grid">
        <p>
          cache filled <strong>{feed.filledAt}</strong>
        </p>
        <p>
          cold delay <strong>{feed.delayMs}ms</strong>
        </p>
        <p>
          feed recomputes <strong>{feed.profileFeedRecomputes}</strong>
        </p>
        <p>
          mutations <strong>{feed.mutationCount}</strong>
        </p>
        <p>
          Ada reposted <strong>{String(feed.repostedByAda)}</strong>
        </p>
      </div>
      {feed.feedItems.length === 0 ? (
        <p>No profile items.</p>
      ) : (
        feed.feedItems.map(item => (
          <article className="drop-card" key={item.id}>
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
      <div className="stack">
        <span className="skeleton" style={{ width: 94 }} />
        <span className="skeleton" style={{ width: 160 }} />
        <span className="skeleton" style={{ width: '85%' }} />
      </div>
      <div className="metric-grid">
        <span className="skeleton" />
        <span className="skeleton" />
        <span className="skeleton" />
      </div>
      <div className="drop-card">
        <span className="skeleton" style={{ width: 80 }} />
        <span className="skeleton" style={{ width: '75%' }} />
      </div>
    </section>
  );
}
