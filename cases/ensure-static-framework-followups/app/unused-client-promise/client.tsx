"use client";

import { use } from "react";

export function UseServerDataOnlyInBrowser({
  serverData,
}: {
  serverData: Promise<string>;
}) {
  if (typeof window !== "undefined") {
    use(serverData);
  }

  return <p>Server data is retained for browser use</p>;
}
