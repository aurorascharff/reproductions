"use client";

import { type ReactNode, useEffect, useState } from "react";

export default function HydrationGate({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  return hydrated ? children : <main>Static app bootstrap shell</main>;
}
