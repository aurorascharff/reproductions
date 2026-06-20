import { TargetBody } from "../_components/target-body";

// The Adopting Partial Prefetching guide's audit table recommends
// `prefetch = 'allow-runtime'` for "routes that read request data" — which is
// exactly this route. But it does NOT silence the warning either.
//
// Source: 'allow-runtime' sets PrefetchHint.HasRuntimePrefetch, a DIFFERENT bit
// from SubtreeHasPartialPrefetching that the warning gate
// (navigation.ts: `(prefetchHints & SubtreeHasPartialPrefetching) === 0`)
// does not check. So navigating here STILL fires the warning.
export const prefetch = "allow-runtime";

export default function Page() {
  return (
    <TargetBody label="/target-allow-runtime — prefetch = 'allow-runtime' (STILL WARNS)" />
  );
}
