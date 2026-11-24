import formatMessage from './format-message';

/**
 * Assert a condition.
 */
export default function assertType(condition: boolean, message: string, ...args: unknown[]): asserts condition {
  if (!condition) {
    throw new TypeError(formatMessage(message, args));
  }
}
