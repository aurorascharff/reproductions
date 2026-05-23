'use client';

export function PrefetchToggle() {
  const handleClick = () => {
    const hasCookie = document.cookie.includes('no-prefetch=1');
    if (hasCookie) {
      document.cookie = 'no-prefetch=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    } else {
      document.cookie = 'no-prefetch=1; path=/';
    }
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        border: '2px solid #333',
        borderRadius: 6,
        cursor: 'pointer',
        background: 'white',
      }}
    >
      Toggle no-prefetch cookie + reload
    </button>
  );
}
