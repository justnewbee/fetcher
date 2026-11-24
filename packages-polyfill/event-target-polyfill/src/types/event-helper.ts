import {
  IEventClassType
} from './claz';

/**
 * The event-like object that can be wrapped.
 */
export type TEventLike = { readonly type: string; } & Partial<IEventClassType>;

/**
 * The wrapper type of the given event-like object.
 */
export type TEventWrapperOf<T extends TEventLike> = IEventClassType<T['type']> & Omit<T, keyof IEventClassType>;

/**
 * The options of the `Event` constructor.
 * @see https://dom.spec.whatwg.org/#dictdef-eventinit
 */
export interface IEventInit {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}
