export type TErrorInform = (error: unknown, title?: string) => void;

export interface IErrorFinalizerClass {
  /**
   * 通知用户，如 error 为空或者是 `AbortError`，则直接忽略
   *
   * 注意：这里不做任何 UI 实现
   */
  inform: TErrorInform;
  
  /**
   * 静默失败，主动忽略错误，但又不完全静默（开发和测试环境有控制台输出），用以忽略不重要的运行时错误
   */
  ignore(error: unknown): void;
  
  /**
   * `inform` 的默认实现用的是 console，但在具体的应用中，一定需要更具体的实现
   */
  setAdapter(adapter: TErrorInform): void;
  
  /**
   * 避免多次调用 `setAdapter` 造成混乱
   */
  freeze(): void;
}

export interface IErrorFinalizer extends Pick<IErrorFinalizerClass, 'inform' | 'ignore'> {}
