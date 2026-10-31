import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>io() prefetch repro</h1>
      <ul>
        <li>
          <Link href="/no-io" prefetch={true}>
            no io — instant
          </Link>
        </li>
        <li>
          <Link href="/io" prefetch={true}>
            io() — incorrectly shows loading
          </Link>
        </li>
        <li>
          <Link href="/connection" prefetch={true}>
            connection() — expected loading
          </Link>
        </li>
      </ul>
    </main>
  )
}
