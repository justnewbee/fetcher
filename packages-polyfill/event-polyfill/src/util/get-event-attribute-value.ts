import {
  IEventClassType,
  TAnyEventTarget,
  TEventListenerCallbackFunction
} from '../types';

import {
  mapOfEventTargetListenerListMapGet
} from './map-of-event-target-listener-list-map';

/**
 * Get the current value of a given event attribute.
 */
export default function getEventAttributeValue<Target extends TAnyEventTarget, EventType extends IEventClassType>(target: Target, type: string): TEventListenerCallbackFunction<Target, EventType> | null {
  const listMap = mapOfEventTargetListenerListMapGet(target, 'target');
  
  return (listMap[type]?.attrCallback ?? null) as unknown as TEventListenerCallbackFunction<Target, EventType> | null;
}
