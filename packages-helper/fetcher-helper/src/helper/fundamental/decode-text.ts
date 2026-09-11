import decodeTextFallback from './decode-text-fallback';

let singletonTextDecoder: TextDecoder | null = null;

function getTextDecoder(): TextDecoder | null {
  if (singletonTextDecoder) {
    return singletonTextDecoder;
  }
  
  if (typeof TextDecoder !== 'undefined') {
    singletonTextDecoder = new TextDecoder();
    
    return singletonTextDecoder;
  }
  
  return null;
}

/**
 * MP 环境下，微信开发者工具支持 TextDecoder，但真机不支持 TextDecoder
 */
export default function decodeText(input: Uint8Array | ArrayBuffer): string {
  const textDecoder = getTextDecoder();
  
  if (textDecoder) {
    return textDecoder.decode(input);
  }
  
  return decodeTextFallback(input);
}
