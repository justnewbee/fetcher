import {
  vi
} from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a spy must wrap arbitrary function signatures
type TAnyFunction = (...args: any[]) => any;

/**
 * A single call recorded by a spy.
 */
export interface ISpyCall<T extends TAnyFunction> {
  readonly arguments: Parameters<T>;
  readonly this: unknown;
  readonly type: 'return' | 'throw' | 'incomplete';
  readonly return?: ReturnType<T>;
  readonly throw?: unknown;
}

/**
 * A minimal drop-in replacement for `@mysticatea/spy`.
 */
export type TSpy<T extends TAnyFunction = () => void> = T & {
  readonly calls: ISpyCall<T>[];
};

export default function spy<T extends TAnyFunction>(impl?: T): TSpy<T> {
  const fn = (impl ? vi.fn(impl) : vi.fn()) as unknown as {
    mock: {
      calls: unknown[][];
      contexts: unknown[];
      results: {
        type: 'return' | 'throw' | 'incomplete';
        value: unknown;
      }[];
    };
  };
  
  Object.defineProperty(fn, 'calls', {
    get() {
      return fn.mock.calls.map((args, index) => {
        const result = fn.mock.results[index];
        const call: {
          arguments: unknown[];
          this: unknown;
          type: 'return' | 'throw' | 'incomplete';
          return?: unknown;
          throw?: unknown;
        } = {
          arguments: args,
          this: fn.mock.contexts[index],
          type: result?.type ?? 'incomplete'
        };
        
        if (result?.type === 'throw') {
          call.throw = result.value;
        } else if (result !== undefined) {
          call.return = result.value;
        }
        
        return call;
      });
    }
  });
  
  return fn as unknown as TSpy<T>;
}
