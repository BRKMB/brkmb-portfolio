function copyTextSync(text: string): boolean {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function copyTextToClipboard(text: string): Promise<boolean> {
  if (copyTextSync(text)) return Promise.resolve(true);

  if (!navigator.clipboard?.writeText) return Promise.resolve(false);

  return navigator.clipboard.writeText(text).then(
    () => true,
    () => false
  );
}

export { copyTextSync };
