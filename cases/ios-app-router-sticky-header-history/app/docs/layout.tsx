import type {ReactNode} from 'react';
import {Header} from './Header';

export default function DocsLayout({children}: {children: ReactNode}) {
  return (
    <div className="docs-shell">
      <Header />
      <div className="docs-grid">
        <aside>
          <p className="eyebrow">Documentation</p>
          <p>The header above is shared by both routes.</p>
        </aside>
        {children}
      </div>
    </div>
  );
}
