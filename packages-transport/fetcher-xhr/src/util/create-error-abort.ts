import {
  createAbortError
} from '@fetchx/fetcher-helper';

export default function createErrorAbort(url: string): Error {
  return createAbortError(`Xhr aborted, url = ${url}`);
}
