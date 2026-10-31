import { cacheLife } from 'next/cache'

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export async function getCachedData(kind) {
  'use cache: remote'
  cacheLife({ stale: 300, revalidate: 60, expire: 300 })

  await delay(4000)

  return {
    kind,
    message: 'content',
  }
}
