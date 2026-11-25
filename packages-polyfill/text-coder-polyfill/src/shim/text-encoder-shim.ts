import {
  ITextEncoderClassType,
  ITextEncoderEncodeIntoResult
} from '../types';
import {
  getCodePoint,
  getUtf8Length,
  writeUtf8
} from '../util';

/**
 * An implementation of the `TextEncoder` interface.
 *
 * @see https://encoding.spec.whatwg.org/#interface-textencoder
 */
export default class TextEncoderShim implements ITextEncoderClassType {
  /**
   * Always returns `'utf-8'`.
   */
  public readonly encoding = 'utf-8';
  
  /**
   * Encode the given string to UTF-8 bytes.
   */
  public encode(input = ''): Uint8Array<ArrayBuffer> {
    const bytes: number[] = [];
    
    for (let index = 0; index < input.length;) {
      const {
        codePoint,
        size
      } = getCodePoint(input, index);
      
      index += size;
      
      if (codePoint < 0x80) {
        bytes.push(codePoint);
      } else if (codePoint < 0x800) {
        bytes.push(0xC0 | (codePoint >> 6), 0x80 | (codePoint & 0x3F));
      } else if (codePoint < 0x10000) {
        bytes.push(0xE0 | (codePoint >> 12), 0x80 | ((codePoint >> 6) & 0x3F), 0x80 | (codePoint & 0x3F));
      } else {
        bytes.push(0xF0 | (codePoint >> 18), 0x80 | ((codePoint >> 12) & 0x3F), 0x80 | ((codePoint >> 6) & 0x3F), 0x80 | (codePoint & 0x3F));
      }
    }
    
    return new Uint8Array(bytes);
  }
  
  /**
   * Encode the given string into the destination buffer.
   *
   * The last code point is not written if it does not fully fit in the destination.
   */
  public encodeInto(source: string, destination: Uint8Array): ITextEncoderEncodeIntoResult {
    let read = 0;
    let written = 0;
    
    while (read < source.length) {
      const {
        codePoint,
        size
      } = getCodePoint(source, read);
      const needed = getUtf8Length(codePoint);
      
      if (written + needed > destination.length) {
        break;
      }
      
      written = writeUtf8(destination, written, codePoint);
      read += size;
    }
    
    return {
      read,
      written
    };
  }
}
