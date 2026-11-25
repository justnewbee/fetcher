import {
  TFetcherHeaders
} from '../../types';
import {
  isInstanceofHeaders
} from '../fundamental';

import headersNormalize from './headers-normalize';

export default function headersNormalizeToPlain(headers?: TFetcherHeaders): Record<string, string> {
  if (!headers) {
    return {};
  }
  
  if (isInstanceofHeaders(headers)) {
    const result: Record<string, string> = {};
    
    headers.forEach((value, key) => {
      result[key] = value;
    });
    
    return headersNormalize(result);
  }
  
  return headersNormalize(headers);
}
