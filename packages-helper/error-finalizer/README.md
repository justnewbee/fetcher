# @fetchx/error-finalizer

> 不会出错的接口是不存在的，数据层只做两件事：成功返回数据，错误抛异常。应用层必须面向错误编程，
> 在数据层抛错的时候，必须能接住，要么用户感知，要么用户无感，决不可出现「不可用且毫无提示」的情况。

## Usage

```ts
import errorFinalizer from '@fetchx/error-ignore';

importantPromise.catch(errorFinalizer.prompt);
unimportantPromise.catch(errorFinalizer.ignore);
```

## Why

1. 所有的错误都必须被处理
   * 让用户知道出错了（弹窗或其他形式的通知）
   * 程序忽略或兜底
2. `errorFinalizer.prompt` 默认也是 `console`，请在应用初始化的时调用 `errorFinalizerSetup` 给具体的 UI 实现
3. `errorFinalizer.ignore` 的作用
   * 避免引 `lodash/noop` 或创建空方法
   * 全然忽略对开发不友好，无法在开发期间快速定位问题，导致消耗大量 debug 时间
