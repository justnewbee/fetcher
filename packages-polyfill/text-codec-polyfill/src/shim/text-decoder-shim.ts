import {
  ITextDecodeOptions,
  ITextDecoderClassType,
  ITextDecoderOptions
} from '../types';
import {
  isUtf8Label,
  toUint8Array,
  fromCodePoint,
  createTextDecoderInternal,
  mapTextDecoderInternalGet,
  mapTextDecoderInternalSet
} from '../util';

const REPLACEMENT_CHARACTER = '\uFFFD';
const BYTE_ORDER_MARK = 0xFEFF;

/**
 * An implementation of the `TextDecoder` interface.
 *
 * Only the UTF-8 encoding is supported.
 * @see https://encoding.spec.whatwg.org/#interface-textdecoder
 */
export default class TextDecoderShim implements ITextDecoderClassType {
  /**
   * Always returns `'utf-8'`.
   */
  public readonly encoding = 'utf-8';
  
  /**
   * Initialize this decoder.
   */
  public constructor(label = 'utf-8', options: ITextDecoderOptions = {}) {
    if (!isUtf8Label(label)) {
      throw new RangeError(`The encoding label provided ('${label}') is invalid.`);
    }
    
    mapTextDecoderInternalSet(this, createTextDecoderInternal(Boolean(options.fatal), Boolean(options.ignoreBOM)));
  }
  
  /**
   * `true` if this decoder throws on invalid input.
   */
  public get fatal(): boolean {
    return mapTextDecoderInternalGet(this).fatal;
  }
  
  /**
   * `true` if this decoder does not strip the BOM.
   */
  public get ignoreBOM(): boolean {
    return mapTextDecoderInternalGet(this).ignoreBOM;
  }
  
  /**
   * Decode the given bytes to a string.
   *
   * @see https://encoding.spec.whatwg.org/#utf-8-decoder
   */
  public decode(input?: ArrayBufferLike | ArrayBufferView, options?: ITextDecodeOptions): string {
    const data = mapTextDecoderInternalGet(this);
    const stream = options?.stream === true;
    
    const bytes = toUint8Array(input);
    let output = '';
    let index = 0;
    
    const handleError = (): void => {
      if (data.fatal) {
        throw new TypeError('The encoded data was not valid.');
      }
      
      output += REPLACEMENT_CHARACTER;
    };
    
    while (index < bytes.length) {
      const byte = bytes[index] ?? 0;
      
      if (data.bytesNeeded === 0) {
        index += 1;
        
        if (byte <= 0x7F) {
          output += String.fromCharCode(byte);
        } else if (byte >= 0xC2 && byte <= 0xDF) {
          data.bytesNeeded = 1;
          data.codePoint = byte & 0x1F;
          data.lowerBoundary = 0x80;
          data.upperBoundary = 0xBF;
        } else if (byte >= 0xE0 && byte <= 0xEF) {
          data.bytesNeeded = 2;
          data.codePoint = byte & 0x0F;
          data.lowerBoundary = byte === 0xE0 ? 0xA0 : 0x80;
          data.upperBoundary = byte === 0xED ? 0x9F : 0xBF;
        } else if (byte >= 0xF0 && byte <= 0xF4) {
          data.bytesNeeded = 3;
          data.codePoint = byte & 0x07;
          data.lowerBoundary = byte === 0xF0 ? 0x90 : 0x80;
          data.upperBoundary = byte === 0xF4 ? 0x8F : 0xBF;
        } else {
          // Consume the invalid leading byte.
          handleError();
        }
        
        continue;
      }
      
      // The byte is not a valid continuation byte, so it will be reprocessed.
      if (byte < data.lowerBoundary || byte > data.upperBoundary) {
        data.bytesNeeded = 0;
        data.codePoint = 0;
        handleError();
        
        continue;
      }
      
      index += 1;
      data.lowerBoundary = 0x80;
      data.upperBoundary = 0xBF;
      data.bytesNeeded -= 1;
      data.codePoint = (data.codePoint << 6) | (byte & 0x3F);
      
      if (data.bytesNeeded === 0) {
        output += fromCodePoint(data.codePoint);
        data.codePoint = 0;
      }
    }
    
    // Flush the incomplete trailing sequence as an error.
    if (!stream && data.bytesNeeded > 0) {
      data.bytesNeeded = 0;
      data.codePoint = 0;
      data.lowerBoundary = 0x80;
      data.upperBoundary = 0xBF;
      handleError();
    }
    
    // The BOM is ignored only at the beginning of the stream.
    if (!data.ignoreBOM && !data.bomSeen && output.length > 0) {
      data.bomSeen = true;
      
      if (output.charCodeAt(0) === BYTE_ORDER_MARK) {
        output = output.slice(1);
      }
    }
    
    // A non-streaming call ends the stream, so the next one starts over.
    if (!stream) {
      data.bomSeen = false;
    }
    
    return output;
  }
}
