import { Suspense } from 'react'
import { ClockWidget } from 'clock-reader'
export default function Page() {
  return <Suspense fallback={<p>Waiting</p>}><ClockWidget /></Suspense>
}
