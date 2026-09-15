import {
  createError
} from '@fetchx/fetcher-helper';

export default function createErrorAbort(url: string): Error {
  return createError(`fetcher-jsonp abort, url = ${url}`, 'AbortError');
}
