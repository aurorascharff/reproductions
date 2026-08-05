'use client';

import { useTransition } from 'react';
import { resetRepro, toggleAdaRepost } from './drop-actions';

export function RepostButton({ reposted }: { reposted: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="button"
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleAdaRepost();
        });
      }}
    >
      {isPending ? 'Saving...' : reposted ? 'Remove repost' : 'Repost'}
    </button>
  );
}

export function ResetButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="button"
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await resetRepro();
        });
      }}
    >
      {isPending ? 'Resetting...' : 'Reset repro state'}
    </button>
  );
}
