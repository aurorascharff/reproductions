import 'server-only';

import { cookies } from 'next/headers';
import { cache } from 'react';

const SESSION = 'demo-user';

export const getUser = cache(async (): Promise<{ handle: string }> => {
  'use cache: private';

  const store = await cookies();
  const handle = store.get(SESSION)?.value ?? 'guest';
  return { handle };
});
