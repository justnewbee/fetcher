import {
  createError
} from '@fetchx/fetcher-helper';

import {
  EFetchErrorName
} from '../enum';

export default function createErrorNetwork(url: string, originalMessage: string): Error {
  return createError(`fetcher-fetch network failure, url = ${url}, message = ${originalMessage}`, EFetchErrorName.NETWORK);
}
