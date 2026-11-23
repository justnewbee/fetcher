import {
  urlGetOrigin
} from '@fetchx/fetcher-helper';

import {
  IFetcherConfig
} from '../types';

export default function configCheckCors(config: IFetcherConfig): boolean {
  if (typeof location === 'undefined') {
    return true;
  }
  
  return (urlGetOrigin(config.url) || urlGetOrigin(config.urlBase)) !== location.origin;
}
