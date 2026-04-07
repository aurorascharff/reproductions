export default function Loading() {
  return (
    <main className="mx-auto max-w-lg space-y-4 p-8 font-sans">
      <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
      <div className="h-8 w-48 animate-pulse rounded bg-zinc-200" />
      <div className="h-6 w-24 animate-pulse rounded bg-zinc-200" />
      <div className="h-5 w-full animate-pulse rounded bg-zinc-200" />
    </main>
  );
}
