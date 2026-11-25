# @fetchx/fetcher-sse-adapter-taro

Fetcher SSE adapter for MP using Taro.

## 注意

* H5 下没有 onHeadersReceived、onChunkReceived，因此 H5 下不要用此适配器
* 会依赖 TextDecoder、AbortController，但小程序环境不支持，请在小程序下自行 Polyfill，可以用
  - `@fetchx/abort-event-polyfill` for `AbortController`、`AbortSignal` 等
  - `@fetchx/text-codec-polyfill` for `TextDecoder` 和 `TextEncoder`
