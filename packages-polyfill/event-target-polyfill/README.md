# @fetchx/event-target-polyfill

> Common purpose [EventTarget] ponyfill & polyfill. A fork of [event-target-shim] v6.0.2.

## Why

* 虽然 `EventTargetShim` 已经是 Baseline Widely Available，但可恶的小程序时依然不支持。
* 直接移植 [event-target-shim] 的核心实现，仅调整构建与严格类型检查以适配本仓库。

## Usage

Ponyfill：

```ts
import EventTarget, { Event } from '@fetchx/event-target-polyfill';

const target = new EventTarget();

target.addEventListener('foo', event => {
  console.log(event.type);
});

target.dispatchEvent(new Event('foo'));
```

Polyfill：

```ts
import EventTarget from '@fetchx/event-target-polyfill';

if (typeof globalThis.EventTarget === 'undefined') {
  globalThis.EventTarget = EventTarget;
}
```

## License

MIT。原始实现版权归 Toru Nagashima 及其他贡献者所有，同样以 MIT 协议发布。

[EventTarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
[event-target-shim]: https://github.com/mysticatea/event-target-shim
