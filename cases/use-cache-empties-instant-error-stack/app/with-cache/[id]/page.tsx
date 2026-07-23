"use cache";

// Generic static params — the GSP shell validation only runs with Partial
// Prefetching enabled (next.config.ts).
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

// `params` is awaited at the top of the page (the same shape as the real
// next-app-router-playground page that reported this). The insight fires — but
// because this file is `use cache`, its Call Stack has NO user frame.
//
// Inside a cache boundary React renders this subtree as a detached task, so both
// React.captureOwnerStack() and errorInfo.componentStack are truncated at the
// cache boundary. The error's stack is assembled from those in addErrorContext()
// (next/dist/esm/server/app-render/dynamic-rendering.js), so nothing survives the
// RSC serialize -> revive round trip and the overlay / terminal shows only
// "at ignore-listed frames".
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <h1>with-cache — product {id}</h1>;
}
