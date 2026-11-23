import { Suspense } from 'react'
import { io } from 'next/cache'
import { readValues } from '../values'

async function cached() {
  'use cache'
  await io()
  return readValues()
}

async function Current() {
  await io()
  return <output id="request-values">{readValues()}</output>
}

export default async function Page() {
  return <main><output id="cached-values">{await cached()}</output>
    <Suspense fallback={<p>Waiting for values</p>}><Current /></Suspense></main>
}
