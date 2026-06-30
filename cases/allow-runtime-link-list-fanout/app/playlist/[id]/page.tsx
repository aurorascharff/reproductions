import { Suspense } from 'react';
import { getPlaylistTracks } from '@/app/lib/playlists';

export const prefetch = 'allow-runtime';

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <h1>Playlist {id}</h1>
      <Suspense fallback={<p>loading tracks…</p>}>
        <Tracks id={id} />
      </Suspense>
    </div>
  );
}

async function Tracks({ id }: { id: string }) {
  const tracks = await getPlaylistTracks(id);
  return (
    <ul>
      {tracks.map(track => (
        <li key={track}>{track}</li>
      ))}
    </ul>
  );
}
