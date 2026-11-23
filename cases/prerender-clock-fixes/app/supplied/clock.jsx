'use client'
import { useState } from 'react'
export function Clock({ initialTime }) {
  const [now] = useState(initialTime)
  return <time id="supplied" data-stamp={now}>{now}</time>
}
