import { Suspense } from 'react'
import { io } from 'next/cache'
import { Clock } from './clock'
async function Sample() {
  await io()
  return <Clock initialTime={Date.now()} />
}
export default function Page() {
  return <Suspense fallback={<p>Waiting</p>}><Sample /></Suspense>
}
