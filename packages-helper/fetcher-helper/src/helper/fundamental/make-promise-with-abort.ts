import {
  IPromiseWithAbort
} from '../../types';

export default function makePromiseWithAbort<T = unknown>(promise: Promise<T>, abortController: AbortController): IPromiseWithAbort<T> {
  let finished = false;
  const promiseWithAbort = promise.finally(() => {
    finished = true;
  }) as IPromiseWithAbort<T>;
  
  promiseWithAbort.abort = (): boolean => {
    if (!finished) {
      abortController.abort();
    }
    
    return !finished;
  };
  
  return promiseWithAbort;
}
