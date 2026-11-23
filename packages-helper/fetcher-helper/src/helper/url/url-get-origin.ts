/**
 * 绝对 URL 正则，提取 origin
 *
 * 「A URL is considered absolute if it begins with "<protocol>://" or "//" (protocol-relative URL).
 * RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
 * by any combination of letters, digits, plus, period, or hyphen.」
 */
const REG_ORIGIN = /^(?:https?:)?\/\/[^/]+/i;

/**
 * 提取 URL 中的 origin 进行标准化，如果能够提取到则说明是绝对地址
 */
export default function urlGetOrigin(url?: string): string {
  const domain = url ? REG_ORIGIN.exec(url)?.[0] ?? '' : '';
  
  try {
    if (domain) {
      return new URL(domain, location.href).origin;
    }
  } catch (_err) {
    // ignore
  }
  
  return domain;
}
