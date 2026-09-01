import createLoggerBase, {
  SlsLogger,
  CreateLoggerOptions
} from '@fetchx/sls-logger-base';

import transport from './transport';

export default function createLogger(options: CreateLoggerOptions): SlsLogger {
  return createLoggerBase(transport, options);
}
