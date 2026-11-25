import {
  ITextDecoderClassType,
  ITextDecoderInternal
} from '../types';

const theMap = new WeakMap<ITextDecoderClassType, ITextDecoderInternal>();

/**
 * Get the internal data of a given decoder.
 */
export function mapTextDecoderInternalGet(decoder: ITextDecoderClassType): ITextDecoderInternal {
  const data = theMap.get(decoder);
  
  if (data === undefined) {
    const value: unknown = decoder;
    
    throw new TypeError(`Expected 'this' to be a 'TextDecoder' object, but got ${value === null ? 'null' : typeof value}`);
  }
  
  return data;
}

export function mapTextDecoderInternalSet(target: ITextDecoderClassType, data: ITextDecoderInternal): void {
  theMap.set(target, data);
}
