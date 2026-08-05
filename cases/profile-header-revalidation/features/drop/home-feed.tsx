import { getAdaRepostState, getHomeFeed } from '../../lib/repro-store';
import { RepostButton } from './repost-button';

export async function HomeFeed() {
  const [feed, interaction] = await Promise.all([getHomeFeed(), getAdaRepostState()]);

  return (
    <section className="card" data-testid="home-feed">
      <p className="eyebrow">private cached home feed</p>
      <h2>Home feed</h2>
      <p className="muted">
        Repost invalidates <code>feed</code>, <code>user-drops-ada</code>, and <code>drop-interactions:ada</code>.
      </p>
      <div className="metric-grid">
        <p>
          feed filled <strong>{feed.filledAt}</strong>
        </p>
        <p>
          feed delay <strong>{feed.delayMs}ms</strong>
        </p>
        <p>
          feed recomputes <strong>{feed.feedRecomputes}</strong>
        </p>
        <p>
          interaction filled <strong>{interaction.filledAt}</strong>
        </p>
        <p>
          interaction delay <strong>{interaction.delayMs}ms</strong>
        </p>
        <p>
          interaction recomputes <strong>{interaction.interactionRecomputes}</strong>
        </p>
        <p>
          mutations <strong>{feed.mutationCount}</strong>
        </p>
      </div>
      {feed.items.map(item => (
        <article className="drop-card" key={item.id}>
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
      <div className="stack">
        <span className="skeleton" style={{ width: 92 }} />
        <span className="skeleton" style={{ width: 128 }} />
        <span className="skeleton" style={{ width: '90%' }} />
      </div>
      <div className="metric-grid">
        <span className="skeleton" />
        <span className="skeleton" />
        <span className="skeleton" />
      </div>
      {Array.from({ length: 2 }).map((_, index) => (
        <div className="drop-card" key={index}>
          <span className="skeleton" style={{ width: 70 }} />
          <span className="skeleton" style={{ width: '82%' }} />
        </div>
      ))}
    </section>
  );
}
