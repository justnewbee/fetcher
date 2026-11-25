import _isError from 'lodash/isError';

import createError from './create-error';

/**
 * 由于 JavaScript 的自由行，你甚至可以 `throw undefined`，这里将传入的一切不可靠信息转成可靠的 Error 对象
 */
export default function ensureError(originalError: unknown): Error {
  // 某些错误，比如 DOMException，在严格模式下，对其 name 进行赋值将抛错「TypeError: setting getter-only property "name"」
  // 而非严格模式下，错误会被忽略
  if (_isError(originalError)) {
    try {
      originalError.name = originalError.name || 'Error';
      
      return originalError;
    } catch (_err) { // Clone 错误，避免后续的 name 只读造成的运行时错误
      const err = createError(originalError.message);
      
      err.name = originalError.name;
      err.stack = originalError.stack;
      err.cause = originalError.cause;
      
      return err;
    }
  }
  
  if (!originalError) {
    return createError();
  }
  
  if (typeof originalError === 'string') {
    return createError(originalError);
  }
  
  return createError(originalError.toString()); // eslint-disable-line @typescript-eslint/no-base-to-string
}
