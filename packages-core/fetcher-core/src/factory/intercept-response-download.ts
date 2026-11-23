import {
  isInstanceofBlob,
  isInstanceofArrayBuffer
} from '@fetchx/fetcher-helper';
import {
  downloadBlob,
  downloadArrayBuffer
} from '@fetchx/fetcher-helper-file';

import {
  EFetcherResponseType
} from '../enum';
import {
  IFetcherConfig,
  IFetcherResponse
} from '../types';
import {
  configToDownloadFilename
} from '../util';

export default function interceptResponseDownload(o: unknown, config: IFetcherConfig, fetcherResponse?: IFetcherResponse): unknown {
  if (!o) {
    return o;
  }
  
  if (isInstanceofBlob(o) && config.responseType === EFetcherResponseType.BLOB_DOWNLOAD) {
    downloadBlob(o, configToDownloadFilename(config, fetcherResponse));
  }
  
  if (isInstanceofArrayBuffer(o) && config.responseType === EFetcherResponseType.ARRAY_BUFFER_DOWNLOAD) {
    downloadArrayBuffer(o, configToDownloadFilename(config, fetcherResponse));
  }
  
  return o;
}
