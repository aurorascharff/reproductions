'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useTransition } from 'react';
import type { Route } from 'next';

export function NavLink({ href, label }: { href: Route; label: string }) {
  return (
    <Suspense
      fallback={
        <Link
          href={href}
          style={{ color: 'gray', fontWeight: 'normal', display: 'block', padding: '4px' }}
        >
          {label} ❌ (fallback — should be replaced after hydration)
        </Link>
      }
    >
      <NavLinkInner href={href} label={label} />
    </Suspense>
  );
}

function NavLinkInner({ href, label }: { href: Route; label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={e => {
        e.preventDefault();
        startTransition(() => {
          router.push(href);
        });
      }}
      style={{
        color: isActive ? 'green' : 'gray',
        fontWeight: isActive ? 'bold' : 'normal',
        display: 'block',
        padding: '4px',
        opacity: isPending ? 0.5 : 1,
      }}
    >
      {label} {isActive ? '✅ ACTIVE' : '(inner, inactive)'}
    </Link>
  );
}
