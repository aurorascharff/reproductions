'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import type { Route } from 'next';

export function NavLink({ href, label }: { href: Route; label: string }) {
  return (
    <Suspense
      fallback={
        <Link
          href={href}
          style={{ color: 'gray', fontWeight: 'normal', display: 'block', padding: '4px' }}
        >
          {label} (inactive fallback)
        </Link>
      }
    >
      <NavLinkInner href={href} label={label} />
    </Suspense>
  );
}

function NavLinkInner({ href, label }: { href: Route; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      style={{
        color: isActive ? 'green' : 'gray',
        fontWeight: isActive ? 'bold' : 'normal',
        display: 'block',
        padding: '4px',
      }}
    >
      {label} {isActive ? '✅ ACTIVE' : '(inactive inner)'}
    </Link>
  );
}
