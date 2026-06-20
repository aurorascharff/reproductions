import { TargetBody } from "../_components/target-body";

// THE BUG THIS REPRO IS ABOUT.
// `instant = false` reads like an "ignore / leave this route alone" escape
// hatch (it silences blocking-prerender validation), so you'd expect it to
// also silence the link-prefetch-partial warning. It does NOT.
//
// Source: create-flight-router-state-from-loader-tree.ts only sets the
// SubtreeHasPartialPrefetching hint (the bit the warning checks) when instant
// is `true` or an object — `false` is not counted:
//
//   const isInstant =
//     instantConfig === true ||
//     (typeof instantConfig === 'object' && instantConfig !== null)
//
// So navigating here STILL fires the warning.
export const instant = false;

export default function Page() {
  return (
    <TargetBody label="/target-instant-false — instant = false (STILL WARNS)" />
  );
}
