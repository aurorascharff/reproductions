import Link from 'next/link';

const tracks = Array.from({length: 40}, (_, index) => index + 1);

export function TrackList() {
  return (
    <div className="page-scroll" data-testid="scroll-container">
      <h1>Library</h1>
      <div className="track-list">
        {tracks.map(track => (
          <Link key={track} href="/track" className="track" data-testid={`track-${track}`}>
            Track {track}
          </Link>
        ))}
      </div>
    </div>
  );
}
