/**
 * Convert a value to a string representation.
 */
export default function anyToString(x: unknown): string {
  if (typeof x !== 'object' || x === null) {
    return String(x);
  }

  return Object.prototype.toString.call(x);
}
