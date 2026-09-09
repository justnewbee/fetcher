import {
  TFetcherHeadersNormalized
} from '../../types';
import {
  isInstanceofHeaders
} from '../fundamental';

export default function headersGet(headers: TFetcherHeadersNormalized, key: string): string | null | undefined {
  return isInstanceofHeaders(headers) ? headers.get(key) : headers[key];
}
