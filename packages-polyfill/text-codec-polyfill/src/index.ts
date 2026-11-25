export { default as TextEncoder } from './shim/text-encoder-shim';
export { default as TextDecoder } from './shim/text-decoder-shim';

export { default } from './polyfill';

export type {
  ITextEncoderEncodeIntoResult as TextEncoderEncodeIntoResult,
  ITextDecoderOptions as TextDecoderOptions,
  ITextDecodeOptions as TextDecodeOptions
} from './types';
