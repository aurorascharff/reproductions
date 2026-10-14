import { Suspense } from 'react'
import { connection } from 'next/server'
import { CurrentTime } from './current-time'

async function RequestTime() {
  await connection()
  return <CurrentTime />
}

export default function Page() {
  return (
    <main>
      <h1>`use(io())` hydration mismatch</h1>
      <Suspense fallback={<time>Loading time…</time>}>
        <RequestTime />
      </Suspense>
    </main>
  )
}
