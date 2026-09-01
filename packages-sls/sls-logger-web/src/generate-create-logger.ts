import {
  CreateLogger,
  GenerateCreateLoggerOptions,
  generateCreateLoggerBase
} from '@fetchx/sls-logger-base';

import transport from './transport';

export default function generateCreateLogger(options: GenerateCreateLoggerOptions): CreateLogger {
  return generateCreateLoggerBase(transport, options);
}
