import { readRandom } from 'clock-reader'
export default function Page() {
  return <main>{readRandom()}</main>
}
