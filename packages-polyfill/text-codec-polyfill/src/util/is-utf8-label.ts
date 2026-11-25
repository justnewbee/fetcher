/**
 * Labels of the UTF-8 encoding.
 *
 * @see https://encoding.spec.whatwg.org/#names-and-labels
 */
const UTF8_LABELS = new Set([
  'unicode-1-1-utf-8',
  'unicode11utf8',
  'unicode20utf8',
  'utf-8',
  'utf8',
  'x-unicode20utf8'
]);

/**
 * Check if the given label points to the UTF-8 encoding.
 */
export default function isUtf8Label(label: string): boolean {
  return UTF8_LABELS.has(label.trim().toLowerCase());
}
