import {
  FetcherError
} from '@fetchx/fetcher-core';

export default function isLoginIgnored(error: FetcherError, ignore?: string | string[]): boolean {
  const url = error.config?.url;
  
  if (!ignore?.length || !url) {
    return false;
  }
  
  return (Array.isArray(ignore) ? ignore : [ignore]).includes(url);
}
