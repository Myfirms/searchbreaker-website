/**
 * Minimal, safe inline formatting for content strings: **bold** and [label](href).
 * Everything else is HTML-escaped. Only relative paths, #anchors and https links are allowed.
 */
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SAFE_HREF = /^(\/|#|https:\/\/)/;

export function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
      const raw = href.replace(/&amp;/g, '&');
      return SAFE_HREF.test(raw) ? `<a href="${escapeHtml(raw)}">${label}</a>` : label;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
