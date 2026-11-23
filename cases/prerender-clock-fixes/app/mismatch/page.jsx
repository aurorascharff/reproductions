import { Suspense } from 'react'
import { connection } from 'next/server'
import { Clock } from './clock'

async function RequestRender() {
  await connection()
  return <Clock />
}
export default function Page() {
  return <Suspense fallback={<p>Waiting</p>}><RequestRender /></Suspense>
}
