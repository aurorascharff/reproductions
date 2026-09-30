"use client";

import Link from "next/link";
import { useState } from "react";

export function PrefetchLink({
  href,
  label,
  prefetch,
}: {
  href: string;
  label: string;
  prefetch: "auto" | true;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setVisible(true)}>
        Reveal {label}
      </button>
      {visible ? (
        <>
          {" "}
          <Link href={href} prefetch={prefetch}>
            Open {label}
          </Link>
        </>
      ) : null}
    </div>
  );
}
