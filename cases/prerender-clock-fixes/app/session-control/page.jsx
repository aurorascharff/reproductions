import { Suspense } from 'react'
import { Session } from '../session'

export const prefetch = 'partial'
export default function Page() {
  return <main><h1>Session control</h1><Suspense fallback={<p>Checking session</p>}><Session mode="control" /></Suspense></main>
}
