'use client';

import { useEffect } from 'react';

export function StringPayload(props: { generatedAt: string; handle: string }) {
  useEffect(() => {
    console.info('hydrated string profile payload', {
      generatedAtIsDate: (props.generatedAt as unknown) instanceof Date,
      handle: props.handle,
    });
  }, [props.generatedAt, props.handle]);

  return (
    <div className="panel">
      <p className="muted">Client Component received string payload</p>
      <h1>@{props.handle}</h1>
      <p>
        <span className="mono">generatedAt instanceof Date:</span> {String((props.generatedAt as unknown) instanceof Date)}
      </p>
      <p>
        <span className="mono">generatedAt:</span> {props.generatedAt}
      </p>
    </div>
  );
}
