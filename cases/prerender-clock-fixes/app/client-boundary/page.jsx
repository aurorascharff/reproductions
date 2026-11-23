import { Suspense } from 'react'
import { ClientClock } from 'clock-reader/client'
export default function Page() {
  return <main><h1>Calendar shell</h1><Suspense fallback={<p id="calendar-fallback">Loading calendar</p>}><ClientClock /></Suspense></main>
}
