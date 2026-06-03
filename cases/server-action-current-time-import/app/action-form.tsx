'use client';

import { actionWithCurrentTime } from './actions';

type Props = {
  handle: string;
};

export function ActionForm({ handle }: Props) {
  return (
    <form action={actionWithCurrentTime}>
      <button className="button" type="submit">
        Regenerate {handle}
      </button>
    </form>
  );
}

