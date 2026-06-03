'use client';

import { useEffect } from 'react';

export function DatePayload(props: { generatedAt: Date; handle: string }) {
  useEffect(() => {
    console.info('hydrated profile payload', {
      generatedAtIsDate: props.generatedAt instanceof Date,
      handle: props.handle,
    });
  }, [props.generatedAt, props.handle]);

  return (
    <div className="panel">
      <p className="muted">Client Component received Date payload</p>
      <h1>@{props.handle}</h1>
      <p>
        <span className="mono">generatedAt instanceof Date:</span> {String(props.generatedAt instanceof Date)}
      </p>
      <p>
        <span className="mono">generatedAt.toISOString():</span> {props.generatedAt.toISOString()}
      </p>
    </div>
  );
}
