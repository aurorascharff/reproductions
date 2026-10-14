"use client";

import { useEffect, useState } from "react";

export function HydrationStatus() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <p className="hydration-status">
      Browser effect: {hydrated ? "ran after hydration" : "waiting"}
    </p>
  );
}
