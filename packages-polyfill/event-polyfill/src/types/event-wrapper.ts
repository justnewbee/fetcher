import {
  TEventLike
} from './event';
import {
  IEventClassType
} from './claz';

/**
 * The wrapper type of the given event-like object.
 */
export type TEventWrapperOf<T extends TEventLike> = IEventClassType<T['type']> & Omit<T, keyof IEventClassType>;

/**
 * The constructor of an event wrapper.
 */
export type TEventWrapperConstructor<T extends TEventLike> = new (event: T) => TEventWrapperOf<T>;

/**
 * Private data for event wrappers.
 */
export interface IEventWrapperInternalData {
  readonly original: TEventLike;
}
