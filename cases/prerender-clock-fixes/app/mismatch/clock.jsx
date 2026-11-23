'use client'
import { use, useState } from 'react'
import { io } from 'next/cache'

export function Clock() {
  use(io())
  const [time] = useState(() => Date.now())
  return <time id="mismatch" data-stamp={time}>{time}</time>
}
