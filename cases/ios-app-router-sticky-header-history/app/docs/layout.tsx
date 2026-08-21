import type {ReactNode} from 'react';
import {Header} from './Header';

export default function DocsLayout({children}: {children: ReactNode}) {
  const retention = process.env.NEXT_ACTIVITY_RETENTION === '1' ? 1 : 3;

  return (
    <div className="docs-shell">
      <Header />
      <div className="docs-grid">
        <aside>
          <p className="eyebrow">Documentation</p>
          <p>The header above is shared by both routes.</p>
          <p className="retention">
            Activity route retention: <strong>{retention}</strong>
          </p>
        </aside>
        {children}
      </div>
    </div>
  );
}
