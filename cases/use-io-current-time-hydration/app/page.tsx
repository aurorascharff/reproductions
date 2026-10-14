import { Suspense } from 'react'
import { CurrentTime } from './current-time'

export default function Page() {
  return (
    <Suspense fallback={<time>Loading time…</time>}>
      <CurrentTime />
    </Suspense>
  )
}
