import { TargetBody } from "../_components/target-body";

// The control case. `prefetch = 'partial'` is the only per-route value that
// sets PrefetchHint.SubtreeHasPartialPrefetching — the exact bit the warning
// gate checks. Navigating here is SILENT, proving the warning machinery works
// and that the other two opt-outs simply aren't wired to it.
export const prefetch = "partial";

export default function Page() {
  return (
    <TargetBody label="/target-partial — prefetch = 'partial' (SILENT — the fix)" />
  );
}
