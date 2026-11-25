export interface ICodePointResult {
  codePoint: number;
  size: number;
}

/**
 * The options of the `TextDecoder` constructor.
 * @see https://encoding.spec.whatwg.org/#textdecoder
 */
export interface ITextDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}

/**
 * The options of the `TextDecoder.decode()` method.
 * @see https://encoding.spec.whatwg.org/#textdecoder
 */
export interface ITextDecodeOptions {
  stream?: boolean;
}

/**
 * An implementation of the `TextEncoderEncodeIntoResult` interface.
 * @see https://encoding.spec.whatwg.org/#dictdef-textencoderencodeintoresult
 */
export interface ITextEncoderEncodeIntoResult {
  read: number;
  written: number;
}

/**
 * Internal data of a `TextDecoder`.
 */
export interface ITextDecoderInternal {
  fatal: boolean;
  ignoreBOM: boolean;
  bomSeen: boolean;
  bytesNeeded: number;
  codePoint: number;
  lowerBoundary: number;
  upperBoundary: number;
}
