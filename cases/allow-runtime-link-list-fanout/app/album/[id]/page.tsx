import { Suspense } from 'react';
import { getPlaylist } from '@/app/lib/playlists';

// NO `prefetch = 'allow-runtime'` here. This route uses the default partial
// prefetch (per-route App Shell only) — the control. Clicking these commits to
// the App Shell instantly (skeleton shows), then streams content. No per-link
// runtime render fires on load, so no fan-out and no blocked/no-fallback click.

export default function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p style={{ color: '#999' }}>loading album…</p>}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await getPlaylist(id);
  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>{album.name}</h1>
      <p style={{ marginTop: 0, color: '#666' }}>{album.description}</p>
      <p style={{ color: '#999', fontSize: 13 }}>{album.tracks.length} tracks</p>
      <ol>
        {album.tracks.map(track => (
          <li key={track}>{track}</li>
        ))}
      </ol>
    </div>
  );
}
