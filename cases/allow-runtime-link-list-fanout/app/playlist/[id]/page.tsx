import { Suspense } from 'react';
import { getPlaylist } from '@/app/lib/playlists';

export const prefetch = 'allow-runtime';

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  // `params` is runtime data under cacheComponents, so all access stays inside
  // the Suspense boundary. The App Shell renders the fallback instantly; the
  // runtime prefetch (allow-runtime) resolves the param + cached content — but
  // only once it gets a connection from the pool.
  return (
    <Suspense fallback={<p style={{ color: '#999' }}>loading playlist…</p>}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const playlist = await getPlaylist(id);
  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>{playlist.name}</h1>
      <p style={{ marginTop: 0, color: '#666' }}>{playlist.description}</p>
      <p style={{ color: '#999', fontSize: 13 }}>{playlist.tracks.length} tracks</p>
      <ol>
        {playlist.tracks.map(track => (
          <li key={track}>{track}</li>
        ))}
      </ol>
    </div>
  );
}
