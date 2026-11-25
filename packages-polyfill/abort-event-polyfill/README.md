# @fetchx/abort-event-polyfill

> Common purpose [DOMException], [Event], [EventTarget], [AbortSignal], [AbortController] ponyfill & polyfill. A fork of [abort-controller] & [event-target-shim].
> 如果你需要在小程序中使用 [DOMException]、[Event]、[EventTarget]、[AbortSignal]、[AbortController]，可以考虑使用这个包。

## How to use

```shell
pnpm add --save @fetchx/abort-event-polyfill
```

然后在项目初始化前：

```ts
import polyfill from '@fetchx/abort-event-polyfill';

polyfill();
```

Ponyfill 的形式使用也行，虽然不推荐：

```ts
import {
  Event,
  EventTarget
} from '@fetchx/abort-event-polyfill';

const target = new EventTarget();

target.addEventListener('foo', event => {
  console.info(event.type);
});

target.dispatchEvent(new Event('foo'));
```

## Why

* 虽然 [DOMException]、[Event]、[EventTarget]、[AbortSignal]、[AbortController] 都是 Baseline Widely Available，但可恶的小程序时依然不支持
* 原 Package [abort-controller]、[event-target-shim] 太稳定，6-8 年前的版本，在 Taro 小程序上使用有问题

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

另外 `abort-controller` 和 `event-target-shim` 出自同一作者，但 `abort-controller` 依赖的是 `event-target-shim@5` 而 `event-target-shim` 的最新版本是 `6.0.2`

[DOMException]: https://developer.mozilla.org/en-US/docs/Web/API/DOMException
[Event]: https://developer.mozilla.org/en-US/docs/Web/API/Event
[EventTarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
[AbortController]: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
[AbortSignal]: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
[abort-controller]: https://github.com/mysticatea/abort-controller
[event-target-shim]: https://github.com/mysticatea/event-target-shim
