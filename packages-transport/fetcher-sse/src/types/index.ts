export interface ISseOptions {
  withCredentials?: boolean;
  headers?: Record<string, string>;
  onOpen?(): void;
  onChunk?(chunk: string): void;
  onSuccess?(): void;
  onError?(error: Error): void;
  onAbort?(): void;
  onClose?(reason: 'success' | 'error' | 'abort'): void;
}

export type TSseAbort = () => boolean;
