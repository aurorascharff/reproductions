'use client'
import { useEffect, useRef } from 'react'
import { readClock } from 'clock-reader'
export function Widget() {
  const root = useRef(null)
  useEffect(() => {
    root.current.dataset.initialized = String(readClock())
  }, [])
  return <section ref={root} id="slides"><h2>First slide</h2></section>
}
