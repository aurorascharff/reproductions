import { getAdaRepostState, getHomeFeed } from '../../lib/repro-store';
import { RepostButton } from './repost-button';

export async function HomeFeed() {
  const [feed, interaction] = await Promise.all([getHomeFeed(), getAdaRepostState()]);

  return (
    <section className="card" data-testid="home-feed">
      <h2>Home feed</h2>
      <p className="muted">
        Feed recomputes: <strong>{feed.feedRecomputes}</strong> | Interaction recomputes:{' '}
        <strong>{interaction.interactionRecomputes}</strong> | Mutations: <strong>{feed.mutationCount}</strong>
      </p>
      {feed.items.map(item => (
        <article className="card" key={item.id}>
          <div className="row">
            <div>
              <strong>@{item.authorHandle}</strong>
              <p>{item.body}</p>
              <p className="muted">Ada reposted: {String(item.repostedByAda)}</p>
            </div>
            <RepostButton reposted={interaction.reposted} />
          </div>
        </article>
      ))}
    </section>
  );
}

export function HomeFeedSkeleton() {
  return (
    <section className="card" aria-label="Loading home feed">
      <span className="skeleton" style={{ width: 120 }} />
      <div style={{ height: 12 }} />
      <span className="skeleton" style={{ width: '100%' }} />
    </section>
  );
}
