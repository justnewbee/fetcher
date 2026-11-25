import {
  IEventWrapperInternalData
} from '../types';

import assertType from './assert-type';

const theMap = new WeakMap<object, IEventWrapperInternalData>();

export function mapOfEventWrapperInternalGet(event: object): IEventWrapperInternalData {
  const data = theMap.get(event);
  
  assertType(data !== undefined, '\'this\' is expected an Event object, but got %o', event);
  
  return data;
}

export function mapOfEventWrapperInternalSet(target: object, data: IEventWrapperInternalData): void {
  theMap.set(target, data);
}
