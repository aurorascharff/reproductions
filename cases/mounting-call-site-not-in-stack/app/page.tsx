export default function Home() {
  return (
    <div>
      <h1>Mounting call-site not in the stack</h1>
      <p>
        This page itself reads no request data. The blocking-prerender error
        fires inside <code>app/_components/dynamic-breadcrumb.tsx</code>, which
        is mounted by <code>app/_components/app-sidebar.tsx</code> (rendered
        from the root layout).
      </p>
      <p>
        Open the dev overlay. The stack frames point at{" "}
        <code>dynamic-breadcrumb.tsx</code>. They do <strong>not</strong>{" "}
        mention <code>app-sidebar.tsx</code>, which is where the{" "}
        <code>&lt;Suspense&gt;</code> fix actually has to go.
      </p>
    </div>
  );
}
