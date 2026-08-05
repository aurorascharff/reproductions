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
      <h1>{user.displayName}</h1>
      <p className="muted">@{user.handle}</p>
      <p>{user.bio}</p>
      <p>Followers: {user.followers}</p>
      <p>
        Header component renders: <strong>{headerComponentRenders}</strong>
      </p>
      <p>
        User data recomputes: <strong>{user.userDataRecomputes}</strong>
      </p>
    </section>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <section className="card" aria-label="Loading profile header">
      <span className="skeleton" style={{ width: 90 }} />
      <div style={{ height: 12 }} />
      <span className="skeleton" style={{ width: '65%' }} />
    </section>
  );
}
