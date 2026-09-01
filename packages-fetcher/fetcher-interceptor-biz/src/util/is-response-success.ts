import {
  TResponseResult,
  TIsSuccess
} from '../types';

export default function isResponseSuccess(o: TResponseResult, code: string, checker: TIsSuccess = '200'): boolean {
  if (typeof checker === 'boolean') {
    return checker;
  }
  
  if (typeof checker === 'function') {
    return checker(o);
  }
  
  return checker === code;
}
