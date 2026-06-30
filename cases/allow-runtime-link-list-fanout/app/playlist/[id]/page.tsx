import { Suspense } from 'react';
import { getPlaylistTracks } from '@/app/lib/playlists';

export const prefetch = 'allow-runtime';

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  // `params` is runtime data under cacheComponents, so all access stays inside
  // the Suspense boundary. The App Shell renders the fallback; the runtime
  // prefetch (allow-runtime) resolves the param + cached tracks before the click.
  return (
    <Suspense fallback={<p>loading playlist…</p>}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tracks = await getPlaylistTracks(id);
  return (
    <div>
      <h1>Playlist {id}</h1>
      <ul>
        {tracks.map(track => (
          <li key={track}>{track}</li>
        ))}
      </ul>
    </div>
  );
}
