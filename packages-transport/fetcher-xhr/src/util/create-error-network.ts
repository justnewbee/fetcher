import {
  createError
} from '@fetchx/fetcher-helper';

import {
  EXhrErrorName
} from '../enum';

export default function createErrorNetwork(url: string): Error {
  return createError(`Xhr network failure, url = ${url}`, EXhrErrorName.NETWORK);
}
