import {
  createError
} from '@fetchx/fetcher-helper';

import {
  EJsonpErrorName
} from '../enum';

export default function createErrorNetwork(url: string): Error {
  return createError(`fetcher-jsonp network failure, url = ${url}`, EJsonpErrorName.NETWORK);
}
