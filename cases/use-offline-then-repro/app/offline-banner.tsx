'use client';

import { useOffline } from 'next/offline';

export function OfflineBanner() {
  const offline = useOffline();
  if (!offline) return null;
  return (
    <div style={{ background: '#e54848', color: 'white', padding: '8px 16px', textAlign: 'center', fontSize: 14 }}>
      You are offline
    </div>
  );
}
