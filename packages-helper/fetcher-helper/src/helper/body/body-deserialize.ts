import {
  parse
} from 'qs';

import {
  IFetcherBodySerializeOptions
} from '../../types';
import {
  DEFAULT_SERIALIZE_BODY_OPTIONS
} from '../../const';

export default function bodyDeserialize(body: string, options: IFetcherBodySerializeOptions = DEFAULT_SERIALIZE_BODY_OPTIONS): Record<string, unknown> {
  return parse(body, options);
}
