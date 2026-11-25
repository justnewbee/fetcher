import {
  ICodePointResult
} from '../types';

const REPLACEMENT_CODE_POINT = 0xFFFD;

/**
 * Read the code point at the given index.
 *
 * Lone surrogates are converted to U+FFFD (USVString conversion).
 */
export default function getCodePoint(source: string, index: number): ICodePointResult {
  const first = source.charCodeAt(index);
  
  if (first >= 0xD800 && first <= 0xDBFF && index + 1 < source.length) {
    const second = source.charCodeAt(index + 1);
    
    if (second >= 0xDC00 && second <= 0xDFFF) {
      return {
        codePoint: 0x10000 + ((first - 0xD800) << 10) + (second - 0xDC00),
        size: 2
      };
    }
  }
  
  if (first >= 0xD800 && first <= 0xDFFF) {
    return {
      codePoint: REPLACEMENT_CODE_POINT,
      size: 1
    };
  }
  
  return {
    codePoint: first,
    size: 1
  };
}
