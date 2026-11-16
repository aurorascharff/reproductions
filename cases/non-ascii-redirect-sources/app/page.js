const paths = [
  "/über/example/",
  "/%C3%BCber/example/",
  "/uber/example/",
  "/über-encoded/example/",
  "/%C3%BCber-encoded/example/",
  "/target/",
];

export default function HomePage() {
  return (
    <main>
      <h1>Non-ASCII redirect sources</h1>
      <p>
        Compare a literal Unicode source, an ASCII source, and a percent-encoded
        source in next.config.mjs. Each redirect targets /target/ with status
        301.
      </p>
      <p>These are ordinary browser links, without client-side routing.</p>
      <ul>
        {paths.map((path) => (
          <li key={path}>
            <a href={path}>{path}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
