import fetchMock from 'fetch-mock';

import {
  SlsPostBody
} from '@fetchx/sls-logger-web';

export default function getLastCallBody(): SlsPostBody {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(fetchMock.callHistory.lastCall()?.options.body as string || '');
}
