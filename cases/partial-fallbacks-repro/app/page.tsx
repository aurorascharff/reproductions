import Link from "next/link";

const items = ["alpha", "beta", "gamma", "delta"];

export default function Home() {
  return (
    <div>
      <h1>Partial Fallbacks Repro</h1>
      <p>
        Only &quot;alpha&quot; is in <code>generateStaticParams</code>. The
        others are not pre-rendered.
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((slug) => (
          <li key={slug} style={{ marginBottom: "0.5rem" }}>
            <Link
              href={`/items/${slug}`}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              /items/{slug}
              {slug === "alpha" ? " (in GSP)" : " (not in GSP)"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
