import decodeText from './decode-text';

/**
 * 根据 SSE 标准把所有 `data:` 打头的行提取出来，这里需要注意的是有些行的 `data:` 在前序中已经返回
 */
export default function decodeTextIntoSseChunks(input: Uint8Array | ArrayBuffer): string[] {
  return decodeText(input).split('\n').reduce((acc: string[], v): string[] => {
    const chunk = v.replace(/^data:/, '');
    
    if (chunk.trim() && !chunk.startsWith('retry:')) {
      acc.push(chunk);
    }
    
    return acc;
  }, []);
}
