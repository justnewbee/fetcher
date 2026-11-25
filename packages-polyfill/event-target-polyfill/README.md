# @fetchx/event-target-polyfill

> Common purpose [EventTarget] ponyfill & polyfill. A fork of [event-target-shim] v6.0.2.

## How to use

```shell
pnpm add --save @fetchx/event-target-polyfill
```

然后在项目初始化前：

```ts
import eventTargetPolyfill from '@fetchx/event-target-polyfill';

eventTargetPolyfill(); // 将 Polyfill globalThis.DOMException | Event | EventTarget
```

如果想以 Ponyfill 的形式使用（虽然不推荐）：

```ts
import {
  Event,
  EventTarget
} from '@fetchx/event-target-polyfill';

const target = new EventTarget();

target.addEventListener('foo', event => {
  console.log(event.type);
});

target.dispatchEvent(new Event('foo'));
```

## Why

* 虽然 `EventTargetShim` 已经是 Baseline Widely Available，但可恶的小程序时依然不支持。
* 直接移植 [event-target-shim] 的核心实现，仅调整构建与严格类型检查以适配本仓库。

[EventTarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
[event-target-shim]: https://github.com/mysticatea/event-target-shim
