import Link from 'next/link'

export default function SessionsPage() {
  const sessions = [
    ['aurora-keynote', 'Aurora Keynote'],
    ['designing-for-delay', 'Designing for Delay'],
    ['operational-calm', 'Operational Calm'],
  ] as const

  return (
    <main>
      <h1>Sessions</h1>
      <ul>
        {sessions.map(([slug, title], index) => (
          <li key={slug}>
            <Link
              data-testid={index === 0 ? 'featured-session' : undefined}
              href={`/sessions/${slug}`}
              prefetch={index === 0 ? true : 'auto'}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
