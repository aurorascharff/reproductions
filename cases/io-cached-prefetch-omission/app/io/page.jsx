import Link from 'next/link'
import { io } from 'next/cache'
import { Suspense } from 'react'
import { getCachedData } from '../data'

async function CachedContentAfterIO() {
  await io()
  const data = await getCachedData('io')
  return <p>{data.message}</p>
}

export default function Page() {
  return (
    <main>
      <Link href="/">← back</Link>
      <h1>io()</h1>
      <Suspense fallback={<p>loading…</p>}>
        <CachedContentAfterIO />
      </Suspense>
    </main>
  )
}
