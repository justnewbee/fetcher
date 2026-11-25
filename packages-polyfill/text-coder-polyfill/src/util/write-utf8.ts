/**
 * Write the given code point as UTF-8 bytes, and return the next offset.
 */
export default function writeUtf8(destination: Uint8Array, offset: number, codePoint: number): number {
  if (codePoint < 0x80) {
    destination[offset] = codePoint;
    
    return offset + 1;
  }
  
  if (codePoint < 0x800) {
    destination[offset] = 0xC0 | (codePoint >> 6);
    destination[offset + 1] = 0x80 | (codePoint & 0x3F);
    
    return offset + 2;
  }
  
  if (codePoint < 0x10000) {
    destination[offset] = 0xE0 | (codePoint >> 12);
    destination[offset + 1] = 0x80 | ((codePoint >> 6) & 0x3F);
    destination[offset + 2] = 0x80 | (codePoint & 0x3F);
    
    return offset + 3;
  }
  
  destination[offset] = 0xF0 | (codePoint >> 18);
  destination[offset + 1] = 0x80 | ((codePoint >> 12) & 0x3F);
  destination[offset + 2] = 0x80 | ((codePoint >> 6) & 0x3F);
  destination[offset + 3] = 0x80 | (codePoint & 0x3F);
  
  return offset + 4;
}
