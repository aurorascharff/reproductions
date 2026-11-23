// Unstable APIs linked from the migration guide. Calling Date() reads the
// current time even though it returns a string rather than a Date object.
export function readValues() {
  return [Date(), Math.random(), crypto.randomUUID()].join('|')
}
