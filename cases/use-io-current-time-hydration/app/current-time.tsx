'use client'

import { use } from 'react'
import { io } from 'next/cache'

export function CurrentTime() {
  use(io())
  return <time>{Date.now()}</time>
}
