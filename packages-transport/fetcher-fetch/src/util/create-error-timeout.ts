import {
  createError
} from '@fetchx/fetcher-helper';

import {
  EFetchErrorName
} from '../enum';

export default function createErrorTimeout(url: string, timeout: number): Error {
  return createError(`fetcher-fetch timeout, url = ${url}, timeout = ${timeout}ms`, EFetchErrorName.TIMEOUT);
}
