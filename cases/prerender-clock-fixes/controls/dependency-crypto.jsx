import { readUUID } from 'clock-reader'
export default function Page() {
  return <main>{readUUID()}</main>
}
