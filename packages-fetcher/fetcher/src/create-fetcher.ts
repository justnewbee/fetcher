import factory from '@fetchx/fetcher-core';
import fetcherAdapterWeb, {
  normalizeErrorName
} from '@fetchx/fetcher-adapter-web';

export default factory(fetcherAdapterWeb, normalizeErrorName);
