import Link from "next/link";

async function getMessage() {
  "use cache";
  return "Target B. This page is fully cached and was prefetched.";
}

export default async function TargetB() {
  const message = await getMessage();
  return (
    <main style={{ padding: 24 }}>
      <h1>Target B</h1>
      <p>{message}</p>
      <p>
        <Link href="/">← back</Link>
      </p>
    </main>
  );
}
