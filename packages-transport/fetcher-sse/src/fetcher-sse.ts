import {
  sseWithEventSource,
  sseWithFetch
} from './util';
import {
  ISseOptions
} from './types';

export default function fetcherSse(url: string, options?: ISseOptions, preferEventSource = true): Promise<void> {
  return preferEventSource && !options?.headers && typeof EventSource !== 'undefined' ? sseWithEventSource(url, options) : sseWithFetch(url, options);
}
