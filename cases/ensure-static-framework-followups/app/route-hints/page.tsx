import { PrefetchLink } from "./prefetch-link";

const routes = ["false", "shell", "prefetch"] as const;

export default function Page() {
  return (
    <main>
      <h1>Route-hint stage comparison</h1>
      <p>
        Each target reads <code>cookies()</code> behind Suspense. Compare
        automatic and explicit prefetches in the browser network panel.
      </p>
      <ul>
        {routes.map((stage) => (
          <li key={stage}>
            <PrefetchLink
              href={`/route-hints/${stage}?source=auto`}
              label={`${stage}: automatic prefetch`}
              prefetch="auto"
            />
            <PrefetchLink
              href={`/route-hints/${stage}?source=full`}
              label={`${stage}: full prefetch`}
              prefetch={true}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
