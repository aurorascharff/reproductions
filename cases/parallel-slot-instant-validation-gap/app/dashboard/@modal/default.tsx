// Default for the `@modal` parallel slot. Required by Next.js's
// LayoutProps type generator. Returning `null` is enough to make the
// framework treat the slot as legitimately empty — masking the
// `unstable_instant = true` opt-in on `@modal/page.tsx`.
export default function ModalDefault() {
  return null;
}
