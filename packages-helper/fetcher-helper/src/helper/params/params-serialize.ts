import {
  stringify
} from 'qs';

import {
  TFetcherParams,
  IFetcherParamsSerializeOptions
} from '../../types';
import {
  DEFAULT_SERIALIZE_PARAMS_OPTIONS
} from '../../const';
import {
  isInstanceofUrlSearchParams
} from '../fundamental';

export default function paramsSerialize(params: TFetcherParams, options: IFetcherParamsSerializeOptions = DEFAULT_SERIALIZE_PARAMS_OPTIONS): string {
  if (!params) {
    return '';
  }
  
  if (typeof params === 'string') {
    return params;
  }
  
  if (isInstanceofUrlSearchParams(params)) {
    return params.toString();
  }
  
  return stringify(params, options);
}
