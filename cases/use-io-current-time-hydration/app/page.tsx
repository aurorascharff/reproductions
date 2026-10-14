import { Suspense } from 'react'
import { CurrentTime } from './current-time'

export default function Page() {
  return (
    <main>
      <h1>Current time</h1>
      <Suspense fallback={<time>Loading time…</time>}>
        <CurrentTime />
      </Suspense>
    </main>
  )
}
