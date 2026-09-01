import fetchMock from 'fetch-mock';

import {
  SlsPostBody
} from '../../src';

export default function getLastCallBody(): SlsPostBody {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(fetchMock.callHistory.lastCall()?.options.body as string || '');
}
