"use client";

import { useSearchParams } from "next/navigation";

export function SearchValue() {
  const searchParams = useSearchParams();

  return <p>Query: {searchParams.get("q") ?? "(none)"}</p>;
}
