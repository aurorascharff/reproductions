'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Page() {
  const [target, setTarget] = useState('')
  return <main>{['control', 'io', 'connection'].map(mode =>
    <button key={mode} onClick={() => setTarget(mode)}>{mode}</button>)}
    {target && <Link href={'/session-' + target} prefetch={true}>Open session</Link>}
  </main>
}
