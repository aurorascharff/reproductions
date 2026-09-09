import { unstable_navigation } from 'next/cache'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

type Params = Promise<{ slug: string }>

export default function SessionPage({ params }: { params: Params }) {
  return (
    <main>
      <Suspense fallback={<p data-testid="summary-fallback">Loading session…</p>}>
        <SessionSummary params={params} />
      </Suspense>

      <Suspense fallback={<p data-testid="related-fallback">Loading related sessions…</p>}>
        <RelatedSessions params={params} />
      </Suspense>
    </main>
  )
}

async function SessionSummary({ params }: { params: Params }) {
  const { slug } = await params
  const session = await getSession(slug)
  if (!session) notFound()

  return (
    <header data-testid="session-summary">
      <h1>{session.title}</h1>
      <p>{session.speaker}</p>
      <p>{session.summary}</p>
    </header>
  )
}

async function RelatedSessions({ params }: { params: Params }) {
  await unstable_navigation()
  const { slug } = await params
  const sessions = await getRelatedSessions(slug)

  return (
    <section data-testid="related-sessions">
      <h2>Related sessions</h2>
      {sessions.map((session) => (
        <p key={session}>{session}</p>
      ))}
    </section>
  )
}

async function getSession(slug: string) {
  'use cache'
  await new Promise((resolve) => setTimeout(resolve, 150))

  if (slug !== 'aurora-keynote') return null

  return {
    title: 'Aurora Keynote',
    speaker: 'Mina Park',
    summary: 'Building resilient interfaces for distributed teams.',
  }
}

async function getRelatedSessions(slug: string) {
  'use cache'
  await new Promise((resolve) => setTimeout(resolve, 350))

  return [`Designing for Delay after ${slug}`, 'Operational Calm']
}
