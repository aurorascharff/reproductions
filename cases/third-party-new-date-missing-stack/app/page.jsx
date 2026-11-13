import { BlockingWidget } from "blocking-widget"

export default function Page() {
  return (
    <main>
      <h1>Third-party new Date() missing stack</h1>
      <BlockingWidget />
    </main>
  )
}
