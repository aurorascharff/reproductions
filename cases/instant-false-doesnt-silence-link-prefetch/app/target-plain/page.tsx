import { TargetBody } from "../_components/target-body";

// No opt-out. Navigating here via <Link prefetch={true}> WARNS — the baseline.
export default function Page() {
  return <TargetBody label="/target-plain — no opt-out (expected to WARN)" />;
}
