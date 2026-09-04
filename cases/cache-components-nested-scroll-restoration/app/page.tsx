export default function HomePage() {
  return (
    <div className="page-scroll page-content">
      <h1>Nested scroll restoration</h1>
      <p>
        Open Library, scroll down, and open a track. Then visit Search, Favorites, and Home using the
        navigation. Press Back four times. The Library returns at the top instead of its previous position.
      </p>
    </div>
  );
}
