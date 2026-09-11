import {
  sseWithEventSource,
  sseWithFetch
} from './util';
import {
  ISseOptions,
  TSseAbort
} from './types';

export default function fetcherSse(url: string, options?: ISseOptions, preferEventSource = true): TSseAbort {
  return preferEventSource && !options?.headers && typeof EventSource !== 'undefined' ? sseWithEventSource(url, options) : sseWithFetch(url, options);
}

export type {
  ISseOptions as SseOptions,
  TSseAbort as SseAbort
};
