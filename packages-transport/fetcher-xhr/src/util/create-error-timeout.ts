import {
  createError
} from '@fetchx/fetcher-helper';

import {
  EXhrErrorName
} from '../enum';

export default function createErrorTimeout(url: string, timeout: number): Error {
  return createError(`Xhr timeout, url = ${url}, timeout = ${timeout}ms`, EXhrErrorName.TIMEOUT);
}
