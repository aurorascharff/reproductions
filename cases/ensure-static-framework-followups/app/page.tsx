import Link from "next/link";

const cases = [
  [
    "/browser-instant-false",
    "Blocking use(browser()) still fails even though instant = false should allow it",
  ],
  [
    "/duplicate-client-io-error",
    "An allowed client use(io()) is reported alongside the real connection() hole",
  ],
  [
    "/unused-client-promise",
    "An unused request-dependent promise produces a locationless error",
  ],
  [
    "/short-lived-cache",
    "A short-lived cache receives generic and inapplicable remediation",
  ],
  [
    "/route-hints",
    "Compare runtime prefetch behavior for false, shell, and prefetch",
  ],
] as const;

export default function Home() {
  return (
    <main>
      <h1>ensureStatic framework follow-ups</h1>
      <p>
        Each route isolates one open follow-up from the original framework
        implementation and review.
      </p>
      <ol>
        {cases.map(([href, description]) => (
          <li key={href}>
            <Link href={href} prefetch={false}>
              <code>{href}</code>
            </Link>
            <br />
            {description}
          </li>
        ))}
      </ol>
    </main>
  );
}
