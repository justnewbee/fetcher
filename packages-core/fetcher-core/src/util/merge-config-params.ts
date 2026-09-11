import {
  FetcherParams,
  paramsDeserialize,
  paramsMerge
} from '@fetchx/fetcher-helper';

import {
  IFetcherConfig
} from '../types';

export default function mergeConfigParams(config: IFetcherConfig, params?: FetcherParams): void {
  if (!params) {
    return;
  }
  
  /*
   * 不需要或无法合并的场景：
   *
   * - config.params 为空
   */
  if (!config.params) {
    config.params = params;
    
    return;
  }
  
  config.params = paramsMerge(
      typeof config.params === 'string' ? paramsDeserialize(config.params, config.serializeParams) : config.params,
      typeof params === 'string' ? paramsDeserialize(params, config.serializeParams) : params
  );
}
