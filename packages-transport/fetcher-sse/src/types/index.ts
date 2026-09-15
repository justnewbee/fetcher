import {
  FetcherHeaders
} from '@fetchx/fetcher-helper';

export interface ISseOptions {
  withCredentials?: boolean;
  headers?: FetcherHeaders;
  signal?: AbortSignal | null;
  onOpen?(): void;
  onChunk?(chunk: string): void;
}
