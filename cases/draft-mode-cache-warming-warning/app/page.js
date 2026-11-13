import { getContent } from '../lib/content'

export default async function Page() {
  const content = await getContent()
  return <main>
    <h1>Draft Mode cache warming</h1>
    <p>{content}</p>
    <p><a href="/api/draft?enable=1">Enable Draft Mode</a></p>
    <p><a href="/api/draft?enable=0">Disable Draft Mode</a></p>
  </main>
}
