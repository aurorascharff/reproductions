async function getMessages() {
  "use cache";
  return [
    { id: 1, from: "vercel", subject: "Deployment ready" },
    { id: 2, from: "github", subject: "PR merged" },
    { id: 3, from: "stripe", subject: "Invoice paid" },
  ];
}

export default async function Inbox() {
  const messages = await getMessages();
  return (
    <>
      <h1 style={{ marginTop: 0 }}>Inbox</h1>
      <p style={{ color: "#666", fontSize: 13 }}>
        This page is fully cached with <code>&apos;use cache&apos;</code> and prefetched.
        From a fresh load it commits instantly.
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {messages.map((m) => (
          <li
            key={m.id}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid #eee",
              fontSize: 14,
            }}
          >
            <strong>{m.from}</strong> · {m.subject}
          </li>
        ))}
      </ul>
    </>
  );
}
