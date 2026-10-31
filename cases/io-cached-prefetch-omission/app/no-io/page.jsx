import Link from 'next/link'
import { Suspense } from 'react'
import { getCachedData } from '../data'

async function CachedContent() {
  const data = await getCachedData('static')
  return <p>{data.message}</p>
}

export default function Page() {
  return (
    <main>
      <Link href="/">← back</Link>
      <h1>no io</h1>
      <Suspense fallback={<p>loading…</p>}>
        <CachedContent />
      </Suspense>
    </main>
  )
}
