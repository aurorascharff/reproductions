import { Suspense } from 'react'
import { io } from 'next/cache'
import { readClock } from 'clock-reader'

async function Current() {
  await io()
  const time = readClock()
  return <time data-stamp={time}>{new Date(time).toISOString()}</time>
}
export default function Page() {
  return <main><h1>Request clock</h1><Suspense fallback={<p id="waiting">Waiting for request</p>}><Current /></Suspense></main>
}
