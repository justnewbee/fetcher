/**
 * Convert the given code point to a string.
 */
export default function fromCodePoint(codePoint: number): string {
  if (codePoint <= 0xFFFF) {
    return String.fromCharCode(codePoint);
  }
  
  const offset = codePoint - 0x10000;
  
  return String.fromCharCode((offset >> 10) + 0xD800, (offset & 0x3FF) + 0xDC00);
}
