/**
 * Get the UTF-8 byte length of the given code point.
 */
export default function getUtf8Length(codePoint: number): number {
  if (codePoint < 0x80) {
    return 1;
  }
  
  if (codePoint < 0x800) {
    return 2;
  }
  
  if (codePoint < 0x10000) {
    return 3;
  }
  
  return 4;
}
