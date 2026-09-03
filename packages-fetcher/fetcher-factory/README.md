# @fetchx/fetcher-factory

注意，此 Fetcher 工厂方法，目前仅适用于 Web 端。

## 拦截器

* [x] `@fetchx/fetcher-interceptor-biz` 剥离业务数据，抛出业务错误
* [x] `@fetchx/fetcher-interceptor-cache-local` 本地缓存
* [x] `@fetchx/fetcher-interceptor-merging` 相同接口同一时间调用合并，💥 与 Login 冲突，默认不开启
* [ ] `@fetchx/fetcher-interceptor-retry` 重试 n 次
* [x] `@fetchx/fetcher-interceptor-sls` SLS 日志
* [x] `@fetchx/fetcher-interceptor-login` 使用弹窗进行登录，若多个请求同时需要登录，不会唤起多个

## How to Use

你可以封装自己的 `Fetcher` 实例：

```ts
import fetcherFactory from '@fetchx/fetcher-factory';

// 所有参数均可选
export default fetcherFactory({
  urlBase, // 建议配置
  getHeaders, // 视情况配置
  interceptorBizOptions, // 默认「业务成功」的 code 为 '200'，根据服务接口进行配置
  interceptorSlsOptions, // 希望记录 SLS 日志的，配置它
  interceptorLoginOptions // 若希望支持弹窗式登录，可配置
});
```

如果你的 Fetcher 需要支持多端，因而无法确定 Header、SLS、Login 等，可以不配，而在应用侧利用此包额外输出的以下拦截器进行配置：

* `interceptHeaders`
* `interceptSls`
* `interceptLogin`
