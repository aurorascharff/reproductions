'use client';

import { usePathname } from 'next/navigation';

export function PathnameDisplay() {
  const pathname = usePathname();
  return (
    <p style={{ color: 'green', fontWeight: 'bold', margin: 0 }}>
      ✅ RESOLVED pathname: <code>{pathname}</code>
    </p>
  );
}
