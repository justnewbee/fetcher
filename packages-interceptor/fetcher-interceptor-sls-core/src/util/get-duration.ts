import {
  FetcherConfig
} from '@fetchx/fetcher-core';

export default function getDuration(config: FetcherConfig): number {
  return config._timeStarted ? Date.now() - config._timeStarted : -1;
}
