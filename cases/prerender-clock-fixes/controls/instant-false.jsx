export const instant = false
export default function Page() {
  return <p>{new Date().toISOString()}</p>
}
