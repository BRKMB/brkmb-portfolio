export const LINK_COPIED_EVENT = "brkmb:link-copied";

export function notifyLinkCopied() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LINK_COPIED_EVENT));
}
