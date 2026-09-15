export interface IPromiseWithAbort<T = void> extends Promise<T> {
  abort(): boolean; // 若 Promise 已经完成，不需要执行 abort，将返回 false
}
