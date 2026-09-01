import {
  FetcherErrorName
} from '@fetchx/fetcher-core';
import {
  FetchErrorName
} from '@fetchx/fetcher-fetch';
import {
  XhrErrorName
} from '@fetchx/fetcher-xhr';
import {
  JsonpErrorName
} from '@fetchx/fetcher-jsonp';

export default function normalizeErrorName(errorName: string): FetcherErrorName | undefined {
  switch (errorName as FetchErrorName | XhrErrorName | JsonpErrorName) {
  case FetchErrorName.NETWORK:
  case XhrErrorName.NETWORK:
  case JsonpErrorName.NETWORK:
    return FetcherErrorName.NETWORK;
  case FetchErrorName.TIMEOUT:
  case XhrErrorName.TIMEOUT:
  case JsonpErrorName.TIMEOUT:
    return FetcherErrorName.TIMEOUT;
  default:
    break;
  }
}
