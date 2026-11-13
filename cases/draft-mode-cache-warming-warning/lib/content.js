import { cacheLife } from 'next/cache'

export async function getContent() {
  'use cache'
  cacheLife('hours')
  return 'Deterministic cached content'
}
