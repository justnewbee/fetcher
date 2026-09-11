const TMP_BUFFER_U16 = new Uint16Array(32);

/**
 * 参考自 https://github.com/anonyco/FastestSmallestTextEncoderDecoder/
 *
 * 在 H5 和微信小程序（包括真机）有效，以下全局对象存在
 *
 * - ArrayBuffer
 * - Uint8Array
 * - Uint16Array
 */
export default function decodeTextFallback(input: ArrayBuffer | Uint8Array): string {
  const inputAs8: Uint8Array = input instanceof Uint8Array ? input : new Uint8Array(input);
  
  const len = inputAs8.length;
  const lenMinus32 = len - 32;
  let resultingString = '';
  let cp0 = 0;
  let cp1 = 0;
  let nextEnd = 0;
  let codePoint = 0;
  let minBits = 0;
  let pos = 0;
  let tmpStr = '';
  let tmp = -1;
  
  // Note that tmp represents the 2nd half of a surrogate pair in case a surrogate gets divided between blocks
  for (let index = 0; index < len;) {
    nextEnd = index <= lenMinus32 ? 32 : len - index;
    
    for (; pos < nextEnd; index += 1, pos += 1) {
      cp0 = (inputAs8[index] || 0) & 0xff;
      
      switch (cp0 >> 4) {
      case 15:
        cp1 = (inputAs8[index += 1] || 0) & 0xff;
        
        if ((cp1 >> 6) !== 0b10 || cp0 > 0b11110111) {
          index -= 1;
          
          break;
        }
        
        codePoint = ((cp0 & 0b111) << 6) | (cp1 & 0b00111111);
        minBits = 5; // 20 ensures it never passes -> all invalid replacements
        cp0 = 0x100; //  keep track of th bit size
      // eslint-disable-next-line no-fallthrough
      case 14:
        cp1 = (inputAs8[index += 1] || 0) & 0xff;
        codePoint <<= 6;
        codePoint |= ((cp0 & 0b1111) << 6) | (cp1 & 0b00111111);
        minBits = (cp1 >> 6) === 0b10 ? minBits + 4 | 0 : 24; // 24 ensures it never passes -> all invalid replacements
        cp0 = (cp0 + 0x100) & 0x300; // keep track of th bit size
      // eslint-disable-next-line no-fallthrough
      case 13:
      case 12:
        cp1 = (inputAs8[index += 1] || 0) & 0xff;
        codePoint <<= 6;
        // eslint-disable-next-line no-mixed-operators
        codePoint |= ((cp0 & 0b11111) << 6) | cp1 & 0b00111111;
        minBits = minBits + 7 | 0;
        
        // Now, process the code point
        if (index < len && (cp1 >> 6) === 0b10 && (codePoint >> minBits) && codePoint < 0x110000) {
          cp0 = codePoint;
          codePoint -= 0x10000;
          
          if (codePoint >= 0) { // BMP code point
            tmp = (codePoint >> 10) + 0xD800; // highSurrogate
            cp0 = (codePoint & 0x3ff) + 0xDC00; // lowSurrogate (will be inserted later in the switch-statement)
            
            if (pos < 31) { // notice 31 instead of 32
              TMP_BUFFER_U16[pos] = tmp;
              pos += 1;
              tmp = -1;
            } else { // else, we are at the end of the inputAs8 and let tmp0 be filled in later on
              // NOTE that cp1 is being used as a temporary variable for the swapping of tmp with cp0
              cp1 = tmp;
              tmp = cp0;
              cp0 = cp1;
            }
          } else { // because we are advancing i without advancing pos
            nextEnd += 1;
          }
        } else { // invalid code point means replacing the whole thing with null replacement characters
          cp0 >>= 8;
          index = index - cp0 - 1; // reset index  back to what it was before
          cp0 = 0xfffd;
        }
        
        // Finally, reset the variables for the next go-around
        minBits = 0;
        codePoint = 0;
        nextEnd = index <= lenMinus32 ? 32 : len - index;
      // eslint-disable-next-line no-fallthrough
      default:
        TMP_BUFFER_U16[pos] = cp0; // fill with invalid replacement character
        
        continue;
      }
      
      TMP_BUFFER_U16[pos] = 0xfffd; // fill with invalid replacement character
    }
    
    tmpStr += String.fromCharCode(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        TMP_BUFFER_U16[0], TMP_BUFFER_U16[1], TMP_BUFFER_U16[2], TMP_BUFFER_U16[3],
        TMP_BUFFER_U16[4], TMP_BUFFER_U16[5], TMP_BUFFER_U16[6], TMP_BUFFER_U16[7],
        TMP_BUFFER_U16[8], TMP_BUFFER_U16[9], TMP_BUFFER_U16[10], TMP_BUFFER_U16[11],
        TMP_BUFFER_U16[12], TMP_BUFFER_U16[13], TMP_BUFFER_U16[14], TMP_BUFFER_U16[15],
        TMP_BUFFER_U16[16], TMP_BUFFER_U16[17], TMP_BUFFER_U16[18], TMP_BUFFER_U16[19],
        TMP_BUFFER_U16[20], TMP_BUFFER_U16[21], TMP_BUFFER_U16[22], TMP_BUFFER_U16[23],
        TMP_BUFFER_U16[24], TMP_BUFFER_U16[25], TMP_BUFFER_U16[26], TMP_BUFFER_U16[27],
        TMP_BUFFER_U16[28], TMP_BUFFER_U16[29], TMP_BUFFER_U16[30], TMP_BUFFER_U16[31]
    );
    
    if (pos < 32) {
      tmpStr = tmpStr.slice(0, pos - 32);
    }
    
    if (index < len) {
      TMP_BUFFER_U16[0] = tmp;
      pos = ~tmp >>> 31;
      tmp = -1;
      
      if (tmpStr.length < resultingString.length) {
        continue;
      }
    } else if (tmp !== -1) {
      tmpStr += String.fromCharCode(tmp);
    }
    
    resultingString += tmpStr;
    tmpStr = '';
  }
  
  return resultingString;
}
