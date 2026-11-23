import { io } from 'next/cache'
import { readClock } from 'clock-reader'

export default async function Page() {
  await io()
  return <time>{readClock()}</time>
}
