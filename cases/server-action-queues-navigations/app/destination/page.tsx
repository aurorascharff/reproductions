import { cacheTag } from "next/cache";

async function getItems() {
  "use cache";
  cacheTag("items");
  return ["Item 1", "Item 2", "Item 3"];
}

export default async function Destination() {
  const items = await getItems();
  return (
    <>
      <h1 style={{ marginTop: 0 }}>Destination</h1>
      <p style={{ color: "#666", fontSize: 13 }}>
        Reads a cached function tagged <code>items</code>. The Server Action on
        Home invalidates that same tag. Until the action&apos;s RSC payload
        applies, the prefetched copy of this page is stale — so the router
        holds the navigation until the action returns.
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <li
            key={item}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid #eee",
              fontSize: 14,
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
