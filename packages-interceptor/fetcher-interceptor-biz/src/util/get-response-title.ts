import {
  TResponseResult,
  TGetString
} from '../types';

import getStringFromResponse from './get-string-from-response';

export default function getResponseTitle(o: TResponseResult, getter?: TGetString): string {
  return getStringFromResponse(o, getter || 'title');
}
