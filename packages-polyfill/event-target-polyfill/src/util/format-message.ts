import anyToString from './any-to-string';

/**
 * Convert a text and arguments to one string.
 *
 * @param message The formating text
 * @param args The arguments.
 */
export default function formatMessage(message: string, args: unknown[]): string {
  let i = 0;
  
  return message.replace(/%[os]/gu, () => anyToString(args[i++]));
}
