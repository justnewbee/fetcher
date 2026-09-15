import {
  createError
} from '@fetchx/fetcher-helper';

export default function createErrorAbort(url: string): Error {
  return createError(`Xhr aborted, url = ${url}`, 'AbortError');
}
