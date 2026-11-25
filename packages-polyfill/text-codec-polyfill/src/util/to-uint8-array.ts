/**
 * Convert the given buffer source to a `Uint8Array`.
 */
export default function toUint8Array(input?: ArrayBufferLike | ArrayBufferView): Uint8Array {
  if (input === undefined) {
    return new Uint8Array(0);
  }
  
  if (input instanceof Uint8Array) {
    return input;
  }
  
  if (ArrayBuffer.isView(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }
  
  return new Uint8Array(input);
}
