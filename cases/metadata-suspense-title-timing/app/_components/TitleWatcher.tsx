"use client";
import { useEffect, useState } from "react";

export default function TitleWatcher() {
  const [log, setLog] = useState("Click the link to start timing");

  useEffect(() => {
    let clickStartedAt: number | undefined;
    let titleAtClick = document.title;

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest('a[href="/dynamic"]');
      if (!link) return;

      clickStartedAt = performance.now();
      titleAtClick = document.title;
      setLog(`0ms: click — ${titleAtClick}`);
    };

    const observer = new MutationObserver(() => {
      if (clickStartedAt === undefined || document.title === titleAtClick) return;

      const elapsed = performance.now() - clickStartedAt;
      setLog(
        `0ms: click — ${titleAtClick} | ${elapsed.toFixed(0)}ms: title — ${document.title}`,
      );
      clickStartedAt = undefined;
    });

    document.addEventListener("click", onClick, true);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      document.removeEventListener("click", onClick, true);
      observer.disconnect();
    };
  }, []);

  return <output aria-label="Title timing">{log}</output>;
}
