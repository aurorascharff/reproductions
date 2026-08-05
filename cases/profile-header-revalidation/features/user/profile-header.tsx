import { bumpProfileHeaderRender, getUserHeader } from '../../lib/repro-store';

export async function ProfileHeader({ handle }: { handle: string }) {
  const headerComponentRenders = bumpProfileHeaderRender(handle);
  const user = await getUserHeader(handle);

  if (!user) {
    return (
      <section className="card">
        <h1>User not found</h1>
      </section>
    );
  }

  return (
    <section className="card" data-testid="profile-header">
      <div className="profile-header">
        <div className="avatar" aria-hidden="true">
          {user.displayName.slice(0, 1)}
        </div>
        <div>
          <p className="eyebrow">cached profile header</p>
          <h1>{user.displayName}</h1>
          <p className="muted">@{user.handle}</p>
        </div>
      </div>
      <p>{user.bio}</p>
      <div className="metric-grid">
        <p>
          Followers <strong>{user.followers}</strong>
        </p>
        <p>
          cache filled <strong>{user.filledAt}</strong>
        </p>
        <p>
          cold delay <strong>{user.delayMs}ms</strong>
        </p>
        <p>
          component renders <strong>{headerComponentRenders}</strong>
        </p>
        <p>
          user data recomputes <strong>{user.userDataRecomputes}</strong>
        </p>
      </div>
    </section>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <section className="card" aria-label="Loading profile header">
      <div className="profile-header">
        <span className="skeleton avatar-skeleton" />
        <div className="stack">
          <span className="skeleton" style={{ width: 120 }} />
          <span className="skeleton" style={{ width: 76 }} />
        </div>
      </div>
      <span className="skeleton" style={{ width: '70%' }} />
      <div className="metric-grid">
        <span className="skeleton" />
        <span className="skeleton" />
        <span className="skeleton" />
      </div>
    </section>
  );
}
