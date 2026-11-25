import {
  createAbortError
} from '@fetchx/fetcher-helper';

export default function createErrorAbort(url: string): Error {
  return createAbortError(`fetcher-jsonp abort, url = ${url}`);
}
