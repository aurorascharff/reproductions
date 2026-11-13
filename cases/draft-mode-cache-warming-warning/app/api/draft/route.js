import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

// Local reproduction only. A real preview endpoint must authorize the caller.
export async function GET(request) {
  const draft = await draftMode()
  if (new URL(request.url).searchParams.get('enable') === '1') draft.enable()
  else draft.disable()
  redirect('/')
}
