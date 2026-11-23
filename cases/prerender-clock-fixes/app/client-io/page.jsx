import { Suspense } from 'react'
import { Clock } from '../mismatch/clock'

// Same client component as /mismatch, but without request-time server rendering.
export default function Page() {
  return <main><Suspense fallback={<p>Waiting for client clock</p>}><Clock /></Suspense></main>
}
