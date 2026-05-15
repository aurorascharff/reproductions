// This page declares it wants to be instant. Because the parent layout
// drops `{children}`, the framework can't validate the instant guarantee
// for this segment and emits the "unrendered segment" warning.

export const unstable_instant = false;

export default function TriggerPage() {
  return <p>trigger/page.tsx</p>;
}
