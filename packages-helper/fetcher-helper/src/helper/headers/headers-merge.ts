import {
  TFetcherHeaders,
  TFetcherHeadersNormalized
} from '../../types';
import {
  isInstanceofHeaders,
  cloneTypeHeaders,
  mergeTypeHeaders
} from '../fundamental';

import headersNormalize from './headers-normalize';

export default function headersMerge(headers1: TFetcherHeaders, headers2: TFetcherHeaders): TFetcherHeadersNormalized {
  if (isInstanceofHeaders(headers1) || isInstanceofHeaders(headers2)) {
    return mergeTypeHeaders(cloneTypeHeaders(headers1), cloneTypeHeaders(headers2));
  }
  
  return {
    ...headersNormalize(headers2),
    ...headersNormalize(headers1)
  };
}
