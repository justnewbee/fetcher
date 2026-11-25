/**
 * Error.captureStackTrace 不是 ES 标准，是 V8 私有扩展
 *
 * 两种方法：
 *
 * 1. as
 * 2. 增加 tsconfig 配置 `compilerOptions.types": ["node"]`，并安装 @types/node
 *
 * 选择前者
 */
export interface IErrorCapture {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  captureStackTrace?(error: Error, constructor?: Function): void;
}

/**
 * The error handler.
 */
export type TErrorHandler = (error: Error) => void;
