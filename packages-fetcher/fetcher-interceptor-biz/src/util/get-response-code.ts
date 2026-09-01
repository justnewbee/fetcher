import {
  TResponseResult,
  TGetString
} from '../types';

import getStringFromResponse from './get-string-from-response';

export default function getResponseCode(o: TResponseResult, getter?: TGetString): string {
  return getStringFromResponse(o, getter || 'code');
}
