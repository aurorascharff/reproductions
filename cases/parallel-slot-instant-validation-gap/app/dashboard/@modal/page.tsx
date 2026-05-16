// Target segment for the `@modal` parallel slot. Declares it must be
// instant — the framework should report this file as an unrendered
// segment when the parent layout excludes the slot, but doesn't,
// because `@modal/default.tsx` returns `null` and the framework
// treats that as legitimate.
export const unstable_instant = true;

export default function ModalPage() {
  return (
    <aside style={{ padding: 16, border: "1px solid #ccc" }}>
      <p>@modal/page.tsx</p>
    </aside>
  );
}
