import anyToString from './any-to-string';

/**
 * Convert a text and arguments to one string.
 */
export default function formatMessage(message: string, args: unknown[]): string {
  let i = 0;
  
  return message.replace(/%[os]/gu, () => anyToString(args[i++]));
}
