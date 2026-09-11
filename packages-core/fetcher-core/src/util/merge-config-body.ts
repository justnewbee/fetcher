import {
  FetcherBody,
  isInstanceofBlob,
  bodyDeserialize,
  bodyMerge
} from '@fetchx/fetcher-helper';

import {
  IFetcherConfig
} from '../types';

export default function mergeConfigBody(config: IFetcherConfig, body?: FetcherBody): void {
  if (!body) {
    return;
  }
  
  /*
   * 不需要或无法合并的场景：
   *
   * - config.body 为空
   * - config.body / body 其中之一是 string
   * - config.body / body 其中之一是 Blob
   */
  if (!config.body || isInstanceofBlob(config.body) || isInstanceofBlob(body)) {
    config.body = body;
    
    return;
  }
  
  config.body = bodyMerge(
      typeof config.body === 'string' ? bodyDeserialize(config.body, config.serializeBody) : config.body,
      typeof body === 'string' ? bodyDeserialize(body, config.serializeBody) : body
  );
}
