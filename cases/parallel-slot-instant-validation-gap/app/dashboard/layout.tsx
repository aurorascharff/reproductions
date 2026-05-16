// Parallel-slot exclusion: this layout declares both `children` and
// `modal` slots but conditionally renders only `children`. The
// `@modal/page.tsx` segment opted into instant validation with
// `unstable_instant = true`, but the layout's `shouldShowModal()`
// returns `false`, so the slot never reaches the boundary.
//
// Expected: framework reports `@modal/page.tsx` as an unrendered segment.
// Actual: no error — `@modal/default.tsx` returning null masks the
// opt-in on `@modal/page.tsx`.
function shouldShowModal(): boolean {
  return false;
}

// LayoutProps generator types `modal` as optional when `default.tsx`
// exists, so cast loosely to keep the fixture buildable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardLayout(props: any) {
  const { children, modal } = props as {
    children: React.ReactNode;
    modal: React.ReactNode;
  };
  return (
    <section style={{ padding: 16 }}>
      <h2>dashboard</h2>
      {children}
      {shouldShowModal() ? modal : null}
    </section>
  );
}
