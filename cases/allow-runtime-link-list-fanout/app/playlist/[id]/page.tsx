import { getPlaylist } from '@/app/lib/playlists';

export const prefetch = 'allow-runtime';
// Blocking route: no Suspense boundary, so there's no fallback to stream. The
// navigation is held on the old page until this render resolves — and under the
// prefetch storm that render is stuck behind the pool. Result: click → nothing
// happens for seconds → page swaps in. An entirely unresponsive click.
export const instant = false;

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
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
