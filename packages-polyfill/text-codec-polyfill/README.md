# @fetchx/text-codec-polyfill

> Common purpose [TextEncoder] & [TextDecoder] ponyfill & polyfill. Currently only the UTF-8 encoding is supported.

## How to use

```shell
pnpm add --save @fetchx/text-codec-polyfill
```

然后在项目初始化前：

```ts
import polyfill from '@fetchx/text-codec-polyfill';

polyfill();
```

Ponyfill 的形式使用也行，虽然不推荐：

```ts
import {
  TextDecoder,
  TextEncoder
} from '@fetchx/text-codec-polyfill';

const bytes = new TextEncoder().encode('中文');

console.info(bytes); // Uint8Array [0xE4, 0xB8, 0xAD, 0xE6, 0x96, 0x87]
console.info(new TextDecoder().decode(bytes)); // '中文'
```

## Supported

* `TextEncoder`：`encoding`、`encode()`、`encodeInto()`
* `TextDecoder`：`encoding`、`fatal`、`ignoreBOM`、`decode(input, {stream})`
* UTF-8 的[全部标签]均可用于构造，其他编码标签会抛 `RangeError`
* 支持 BOM 移除、`fatal` 错误模式，以及 `stream` 模式下的分片解码

## Why

* 虽然 [TextEncoder]、[TextDecoder] 都是 Baseline Widely Available，但可恶的小程序时依然不支持
* 原 Package 太稳定，在 Taro 小程序上使用有问题

[TextEncoder]: https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
[TextDecoder]: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
[全部标签]: https://encoding.spec.whatwg.org/#names-and-labels
