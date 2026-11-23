'use client'

// A fixed instant, not a read of "now". The date label changes near midnight
// if SSR and the browser implicitly use different time zones.
export function DateLabel({ fixed }) {
  const when = new Date('2030-01-01T00:30:00Z')
  const options = fixed ? { timeZone: 'UTC' } : {}
  return <time id="date-label">{when.toLocaleDateString('en-US', options)}</time>
}
