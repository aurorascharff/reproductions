// Attempted fix per the dev overlay fix card:
//   "Silence this warning" → `export const instant = false`
//
// Setting this on the *layout* does NOT actually silence the warning when
// the child page below still has `unstable_instant = true`. The framework
// validates the page's instant requirement, sees the parent layout
// dropped `{children}`, and emits:
//
//   Could not validate instant UI because an expected segment was not
//   rendered.
//
// The opt-out only takes effect if it lives on the segment that requested
// instant validation in the first place — moving `instant = false` onto
// `trigger/page.tsx` (or removing `unstable_instant` from there) is what
// actually silences the warning. The fix card overpromises.

export default function TriggerLayout({
  // children intentionally not rendered to fire the unrendered-segment
  // validation warning
  children: _children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section style={{ padding: 16, border: "1px dashed #999" }}>
      <p>
        <strong>trigger/layout.tsx</strong> intentionally drops{" "}
        <code>{"{children}"}</code>.
      </p>
    </section>
  );
}
