"use client";
import { useEffect, useRef, useState } from "react";

function titleNodes(nodes: NodeList) {
  return Array.from(nodes).filter(
    (node) =>
      node.nodeName === "TITLE" ||
      (node instanceof Element && node.querySelector("title")),
  );
}

export default function TitleWatcher() {
  const startedAt = useRef<number | undefined>(undefined);
  const [log, setLog] = useState(["Click a link to start the title trace."]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href="/"], a[href="/dynamic"]',
      );
      if (!link) return;

      startedAt.current = performance.now();
      setLog([
        `0ms: click ${link.pathname} — document.title = ${JSON.stringify(document.title)}`,
      ]);
    };

    const observer = new MutationObserver((records) => {
      if (startedAt.current === undefined) return;

      const changes = records.flatMap((record) => {
        if (record.type === "characterData") return ["title text changed"];

        return [
          ...titleNodes(record.removedNodes).map(() => "title removed"),
          ...titleNodes(record.addedNodes).map(() => "title inserted"),
        ];
      });

      if (changes.length === 0) return;

      const elapsed = performance.now() - startedAt.current;
      const titleCount = document.head.querySelectorAll("title").length;
      setLog((entries) =>
        entries.concat(
          `${elapsed.toFixed(1)}ms: ${changes.join(", ")} — document.title = ${JSON.stringify(document.title)}; <title> count = ${titleCount}`,
        ),
      );
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

  return <output aria-label="Title timing">{log.join("\n")}</output>;
}
