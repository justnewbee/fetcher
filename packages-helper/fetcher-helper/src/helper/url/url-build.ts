import {
  parse
} from 'qs';

import {
  IFetcherParamsSerializeOptions,
  TFetcherParams
} from '../../types';
import {
  paramsSerialize,
  paramsMerge
} from '../params';

export default function urlBuild(url: string, params?: TFetcherParams, serializeOptions?: IFetcherParamsSerializeOptions): string {
  if (!params) {
    return url;
  }
  
  const searchIndex = url.indexOf('?');
  
  if (searchIndex < 0) {
    const paramsStr = paramsSerialize(params, serializeOptions);
    
    return paramsStr ? `${url}?${paramsStr}` : url;
  }
  
  const urlPure = url.substring(0, searchIndex);
  const urlSearch = url.substring(searchIndex + 1);
  const mergedParams = paramsMerge(parse(urlSearch, serializeOptions), typeof params === 'string' ? parse(params, serializeOptions) : params);
  const paramsStr = paramsSerialize(mergedParams, serializeOptions);
  
  return paramsStr ? `${urlPure}?${paramsStr}` : url;
}
