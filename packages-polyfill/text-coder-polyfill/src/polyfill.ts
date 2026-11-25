import TextEncoderShim from './shim/text-encoder-shim';
import TextDecoderShim from './shim/text-decoder-shim';

export default function polyfill(): void {
  if (typeof TextEncoder === 'undefined') {
    globalThis.TextEncoder = TextEncoderShim;
  }
  
  if (typeof TextDecoder === 'undefined') {
    globalThis.TextDecoder = TextDecoderShim;
  }
}
