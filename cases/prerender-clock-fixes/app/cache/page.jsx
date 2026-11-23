import { readClock } from 'clock-reader'
import { cacheLife } from 'next/cache'

async function report() {
  'use cache'
  cacheLife('hours')
  return { title: 'Shared report', generatedAt: readClock() }
}
export default async function Page() {
  const { title, generatedAt } = await report()
  return <main><h1>{title}</h1><time data-stamp={generatedAt}>{generatedAt}</time></main>
}
