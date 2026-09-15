import {
  createError
} from '@fetchx/fetcher-helper';

import {
  EJsonpErrorName
} from '../enum';

export default function createErrorTimeout(url: string, timeout: number): Error {
  return createError(`fetcher-jsonp timeout, url = ${url}, timeout = ${timeout}ms`, EJsonpErrorName.TIMEOUT);
}
