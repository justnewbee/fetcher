import {
  IEventClassType,
  IListenerList,
  TListenerCallback
} from '../types';

/**
 * Define the callback function for the given listener list object.
 * It calls `attrCallback` property if the property value is a function.
 */
export default function defineEventAttributeCallback(list: IListenerList): TListenerCallback {
  return function (this: object, event: IEventClassType): void {
    const callback = list.attrCallback;
    
    if (typeof callback === 'function') {
      callback.call(this, event);
    }
  };
}
