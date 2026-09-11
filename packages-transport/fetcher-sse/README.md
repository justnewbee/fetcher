# @fetchx/fetcher-sse

> 封装 SSE 请求，在无法使用 `EventSource` 的情况下（比如需要传 `headers`，或者 EventSource 不支持的环境），提供以 `fetch` 为底的 Fallback。

🎈 解决的什么问题，为什么不用 `EventSourcePolyfill`？

1. 原生 `EventSource` 只有一个 `withCredentials` 参数，不接收 `headers`
2. `Polyfill` 和 `EventSource` 一样，会无限循环自启动
3. `Polyfill` 版本代码臃肿，有较多过时的逻辑

## 参考

* [SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
* [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
* [EventSourcePolyfill](https://github.com/Yaffle/EventSource)
