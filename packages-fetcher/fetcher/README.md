# @fetchx/fetcher

The Fetcher with web adapter.

## Base

* `@fetchx/fetcher-fetch`
* `@fetchx/fetcher-json`

## Interceptors

* [x] `@fetchx/fetcher-interceptor-biz` 剥离业务数据，抛出业务错误
* [x] `@fetchx/fetcher-interceptor-cache-local` 本地缓存
* [x] `@fetchx/fetcher-interceptor-merging` 相同接口同一时间调用合并
* [ ] `@fetchx/fetcher-interceptor-retry` 重试 n 次
* [x] `@fetchx/fetcher-interceptor-sls` SLS 日志
* [x] `@fetchx/fetcher-interceptor-login` 使用弹窗进行登录，若多个请求同时需要登录，不会唤起多个
