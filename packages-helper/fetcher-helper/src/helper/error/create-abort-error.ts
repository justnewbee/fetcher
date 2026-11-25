import createError from './create-error';

/**
 * 虽然 AbortError 是 DOMException 的一个实例，但为了方便起见，这里不用 DOMException
 */
export default function createAbortError(message?: string): Error {
  return createError(message, 'AbortError');
}
