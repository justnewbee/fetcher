# @fetchx/fetcher-interceptor-sls

SLS logger interceptor for `@fetchx/fetcher`, which can log success and error, plus duration.

## How to Use

```ts
import interceptSls from '@fetchx/fetcher-interceptor-sls';

interceptSls(fetcher, { // suppose you have the fetcher by createFetcher
  project: 'my-sls-project',
  endpoint: '<region>.log.aliyuncs.com',
  logstore: 'my-logstore',
  defaultParams: getDefaultParams
});
```