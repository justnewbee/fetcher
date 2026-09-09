import {
  TFetcherParamsMergeable
} from '../../types';
import {
  isInstanceofUrlSearchParams,
  cloneTypeUrlSearchParams,
  mergeTypeSearchParams
} from '../fundamental';

export default function paramsMerge(params1: TFetcherParamsMergeable, params2: TFetcherParamsMergeable): TFetcherParamsMergeable {
  if (isInstanceofUrlSearchParams(params1) || isInstanceofUrlSearchParams(params2)) {
    return mergeTypeSearchParams(cloneTypeUrlSearchParams(params1), cloneTypeUrlSearchParams(params2));
  }
  
  return {
    ...params2,
    ...params1
  };
}
