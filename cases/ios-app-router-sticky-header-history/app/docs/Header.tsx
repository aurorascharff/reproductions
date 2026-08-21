'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollDetectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsScrolled(!entry.isIntersecting);
    });
    observer.observe(scrollDetectorRef.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={scrollDetectorRef} />
      <div className="sticky-header">
        <header className={isScrolled ? 'site-header is-scrolled' : 'site-header'}>
          <Link className="brand" href="/docs">
            Acme Docs
          </Link>
          <nav aria-label="Documentation">
            <Link
              aria-current={pathname === '/docs' ? 'page' : undefined}
              href="/docs">
              Overview
            </Link>
            <Link
              aria-current={pathname === '/docs/article' ? 'page' : undefined}
              href="/docs/article">
              Article
            </Link>
          </nav>
        </header>
      </div>
    </>
  );
}
