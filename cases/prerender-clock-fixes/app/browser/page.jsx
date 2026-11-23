'use client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [now, setNow] = useState(null)
  const [clicked, setClicked] = useState(null)
  useEffect(() => setNow(Date.now()), [])
  return <main><p id="clock">{now ?? 'Waiting for the browser'}</p>
    <button onClick={() => setClicked(Date.now())}>Read event clock</button>
    <output id="clicked">{clicked ?? 'No click'}</output></main>
}
