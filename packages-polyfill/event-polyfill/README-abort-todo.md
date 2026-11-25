# @fetchx/abort-controller-polyfill

> Common purpose [AbortController] & [AbortSignal] ponyfill & polyfill. A fork of [abort-controller].

## How to use

```shell
pnpm add --save @fetchx/abort-controller-polyfill
```

然后在项目初始化前：

```ts
import '@fetchx/abort-controller-polyfill';
```

## Why

* 虽然 AbortController 已经是 Baseline Widely Available，但可恶的小程序时依然不支持。
* 原 Package 太稳定了，8 年前的版本，在 Taro 小程序上使用有问题

## abort-controller 的问题

小程序下必须放入 `globalThis`，但原 Package 的 polyfill 会判断 `window` 或 `global` 导致 Polyfill 失败。

若使用 Ponyfill 自行 Polyfill 则抛错「 TypeError: Cannot set properties of undefined (setting 'AbortSignal')」。

```ts
import AbortControllerShim, { // ← 此处即抛错
  AbortSignal as AbortSignalShim
} from 'abort-controller';

if (typeof AbortController === 'undefined') {
  globalThis.AbortController = AbortControllerShim; // ← 有类型报错
}

if (typeof AbortSignal === 'undefined') {
  globalThis.AbortSignal = AbortSignalShim; // ← 有类型报错
}
```

[AbortController]: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
[AbortSignal]: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
[abort-controller]: (https://www.npmjs.com/package/abort-controller)
