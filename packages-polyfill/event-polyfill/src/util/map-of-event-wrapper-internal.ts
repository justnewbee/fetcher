import {
  IEventWrapperInternalData
} from '../types';

import assertType from './assert-type';

const theMap = new WeakMap<object, IEventWrapperInternalData>();

export function mapOfEventWrapperInternalGet(event: unknown): IEventWrapperInternalData {
  const retv = theMap.get(event as object);
  
  assertType(retv !== undefined, '\'this\' is expected an Event object, but got %o', event);
  
  return retv;
}

export function mapOfEventWrapperInternalSet(target: object, data: IEventWrapperInternalData): void {
  theMap.set(target, data);
}
