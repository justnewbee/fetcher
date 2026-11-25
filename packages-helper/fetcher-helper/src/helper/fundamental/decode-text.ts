let singletonTextDecoder: TextDecoder | null = null;

function getTextDecoder(): TextDecoder {
  if (singletonTextDecoder) {
    return singletonTextDecoder;
  }
  
  singletonTextDecoder = new TextDecoder();
  
  return singletonTextDecoder;
}

/**
 * MP 环境下，微信开发者工具支持 TextDecoder，但真机不支持 TextDecoder
 */
export default function decodeText(input: Uint8Array | ArrayBuffer | ArrayBufferLike): string {
  return getTextDecoder().decode(input);
}
