import {
  CreateLoggerOptions
} from '@fetchx/sls-logger-base';

export interface IFetcherInterceptorSlsOptions extends CreateLoggerOptions {
  topicSuccess?: string;
  topicError?: string;
}
