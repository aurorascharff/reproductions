import { cookies, headers } from 'next/headers'
import { connection } from 'next/server'
import { io } from 'next/cache'
import { readClock } from 'clock-reader'

export async function Session({ mode }) {
  const visitor = (await cookies()).get('visitor')?.value ?? 'guest'
  const header = (await headers()).get('x-test-visitor') ?? 'none'
  if (mode === 'io') await io()
  if (mode === 'connection') await connection()
  const now = readClock()
  return <p id="session" data-stamp={now}>{visitor}:{header}</p>
}
