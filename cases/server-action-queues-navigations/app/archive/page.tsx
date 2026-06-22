async function getArchive() {
  "use cache";
  return ["old vercel email", "old github email", "old stripe email"];
}

export default async function Archive() {
  const items = await getArchive();
  return (
    <>
      <h1 style={{ marginTop: 0 }}>Archive</h1>
      <p style={{ color: "#666", fontSize: 13 }}>
        Cached and prefetched. Instant from a fresh load.
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((m) => (
          <li
            key={m}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid #eee",
              fontSize: 14,
            }}
          >
            {m}
          </li>
        ))}
      </ul>
    </>
  );
}
