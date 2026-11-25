import {
  ITextEncoderEncodeIntoResult,
  ITextDecodeOptions
} from './common';

/**
 * An implementation of the `TextEncoder` interface.
 * @see https://encoding.spec.whatwg.org/#interface-textencoder
 */
export interface ITextEncoderClassType {
  /**
   * Always returns `'utf-8'`.
   * @see https://encoding.spec.whatwg.org/#dom-textencoder-encoding
   */
  readonly encoding: string;
  /**
   * Encode the given string to UTF-8 bytes.
   * @see https://encoding.spec.whatwg.org/#dom-textencoder-encode
   */
  encode(input?: string): Uint8Array;
  /**
   * Encode the given string into the destination buffer.
   * @see https://encoding.spec.whatwg.org/#dom-textencoder-encodeinto
   */
  encodeInto(source: string, destination: Uint8Array): ITextEncoderEncodeIntoResult;
}

/**
 * An implementation of the `TextDecoder` interface.
 * @see https://encoding.spec.whatwg.org/#interface-textdecoder
 */
export interface ITextDecoderClassType {
  /**
   * Always returns `'utf-8'`.
   * @see https://encoding.spec.whatwg.org/#dom-textdecoder-encoding
   */
  readonly encoding: string;
  /**
   * `true` if this decoder throws on invalid input.
   * @see https://encoding.spec.whatwg.org/#dom-textdecoder-fatal
   */
  readonly fatal: boolean;
  /**
   * `true` if this decoder does not strip the BOM.
   * @see https://encoding.spec.whatwg.org/#dom-textdecoder-ignorebom
   */
  readonly ignoreBOM: boolean;
  /**
   * Decode the given bytes to a string.
   * @see https://encoding.spec.whatwg.org/#dom-textdecoder-decode
   */
  decode(input?: ArrayBufferLike | ArrayBufferView, options?: ITextDecodeOptions): string;
}
