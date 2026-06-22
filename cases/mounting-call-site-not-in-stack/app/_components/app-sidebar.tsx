import { DynamicBreadcrumb } from "./dynamic-breadcrumb";

// Shell-level parent that imports and renders <DynamicBreadcrumb />.
// THIS is where the `<Suspense>` fix actually has to go — wrap the
// `<DynamicBreadcrumb />` mount site below in `<Suspense fallback={...}>`.
//
// Nothing in the dev-overlay error names this file. The stack stops at
// `dynamic-breadcrumb.tsx`, where the throw happens. There is no frame that
// says "and `AppSideBar.tsx` mounted it" — so an agent (or human) following
// the stack lands in the wrong file and tries to wrap the data access inside
// `DynamicBreadcrumb` itself, which doesn't work.
export function AppSideBar() {
  return (
    <aside style={{ borderRight: "1px solid #ccc", padding: 16, width: 200 }}>
      <h2 style={{ fontSize: 14 }}>Sidebar</h2>
      <DynamicBreadcrumb />
      <ul>
        <li>Item one</li>
        <li>Item two</li>
      </ul>
    </aside>
  );
}
