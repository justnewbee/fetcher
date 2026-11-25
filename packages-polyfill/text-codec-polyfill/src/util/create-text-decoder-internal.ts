import {
  ITextDecoderInternal
} from '../types';

/**
 * Create the internal data of a new decoder.
 */
export default function createTextDecoderInternal(fatal: boolean, ignoreBom: boolean): ITextDecoderInternal {
  return {
    fatal,
    ignoreBOM: ignoreBom,
    bomSeen: false,
    bytesNeeded: 0,
    codePoint: 0,
    lowerBoundary: 0x80,
    upperBoundary: 0xBF
  };
}
