import urlGetOrigin from './url-get-origin';

/**
 * 合并 url 与 urlBase，当 url 是绝对地址的时候，不作合并
 */
export default function urlMergeWithBase(url: string, urlBase?: string): string {
  if (!urlBase || urlGetOrigin(url)) {
    return url;
  }
  
  const urlBaseEndsWithSlash = urlBase.endsWith('/');
  const urlStartsWithSlash = url.startsWith('/');
  
  if (urlBaseEndsWithSlash && urlStartsWithSlash) {
    return `${urlBase}${url.slice(1)}`;
  }
  
  if (!urlBaseEndsWithSlash && !urlStartsWithSlash) {
    return `${urlBase}/${url}`;
  }
  
  return `${urlBase}${url}`;
}
