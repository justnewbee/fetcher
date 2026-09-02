# @fetchx/fetcher

一个面向 Web 与 Taro 的 TypeScript 请求工具集。

以 `Fetcher` 为核心，通过可替换的适配器、传输层和拦截器组合出 HTTP、JSONP、上传进度、SSE、缓存、登录重试和 SLS 日志等能力。

> 根目录是 pnpm + Lerna 管理的私有 monorepo；实际发布的包均使用 `@fetchx/*` 命名空间。

## 特性

* 100% TypeScript
* Web 默认实现：基于 `fetch`，需要 JSONP 或上传进度时自动选择合适的传输方式
* 可组合架构：核心层与平台适配器分离，可实现自己的运行时适配器
* 便捷请求：提供 `get`、`post`、`put`、`patch`、`delete`、`jsonp` 和 `request`
* 请求控制：支持超时、取消、请求参数、请求体、Header、下载、响应类型和进度回调
* 拦截器：支持业务响应转换、本地缓存、并发合并、动态 Header、登录重试、延迟和 SLS 上报
* 多端支持：包含 Web 与 Taro 适配器；浏览器端还提供 JSONP、XHR、SSE 和文件辅助工具
* 类型优先：所有发布包同时提供 ESM、CommonJS 和 TypeScript 声明

## 安装与快速开始

### 环境要求

* 使用 `pnpm >= 11` 管理此仓库；根目录的安装钩子会阻止 npm、Yarn 等其他包管理器
* 所有发布包都要求 `@babel/runtime >= 7.0.0`
* 使用 `@fetchx/fetcher-adapter-taro` 时，还需要 `@tarojs/taro >= 4.2.0`

应用中通常只需安装默认 Web 实现：

```bash
pnpm add @fetchx/fetcher @babel/runtime
```

默认实例可直接发起请求：

```ts
import fetcher from '@fetchx/fetcher';

interface IUser {
  id: string;
  name: string;
}

const user = await fetcher.get<IUser>('/api/users/1');
```

默认导出的 `fetcher` 已被冻结，适合无需额外配置的场景。若要设置基础地址或添加拦截器，请创建独立实例。

```ts
import {
  createFetcher
} from '@fetchx/fetcher';

const api = createFetcher({
  urlBase: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

const userId = await api.post<string>('/api/users', {
  name: 'Alice'
});
```

## 核心用法

### 请求方法

`Fetcher` 提供以下方法：

| 方法 | 用途 |
| --- | --- |
| `request<T>(config)` | 以完整配置发起请求 |
| `get<T>(url, params?)` | 发起 GET 请求 |
| `jsonp<T>(url, params?)` | 发起 JSONP 请求 |
| `post<T>(url, body?, params?)` | 发起 POST 请求 |
| `put<T>(url, body?, params?)` | 发起 PUT 请求 |
| `patch<T>(url, body?, params?)` | 发起 PATCH 请求 |
| `delete<T>(url, body?, params?)` | 发起 DELETE 请求 |

快捷方法都支持将配置作为第一个参数传入：

```ts
const result = await api.get<{ items: string[] }>({
  timeout: 5_000
}, '/api/search', {
  keyword: 'fetcher'
});
```

### 取消请求

通过 `withAbort` 使用与普通请求相同的方法，并在返回的 Promise 上调用 `abort()`：

```ts
const pending = api.withAbort.get('/api/slow');

pending.abort();
```

也可在完整配置中传入标准的 `AbortSignal`。

### 拦截请求和响应

拦截器注册后会返回移除函数，`priority` 越小，执行顺序越靠前。

```ts
const ejectRequest = api.interceptRequest(() => ({
  headers: {
    Authorization: 'Bearer <token>'
  }
}));

const ejectResponse = api.interceptResponse((response) => response);

// 不再需要时移除拦截器
ejectRequest();
ejectResponse();
```

创建完成后可调用 `api.freeze()` 锁定实例，避免后续继续注册拦截器。

## 请求配置

使用 `FetcherConfig` 描述完整请求。以下字段最常用：

| 字段 | 说明 |
| --- | --- |
| `url`、`urlBase` | 请求地址及其基础地址 |
| `method` | HTTP 方法 |
| `params` | 查询参数 |
| `body` | 请求体 |
| `headers` | 请求 Header |
| `timeout` | 请求超时时间，单位为毫秒 |
| `credentials` | 凭据策略；Web 跨域请求默认使用 `include`，同源请求默认使用 `same-origin` |
| `signal` | `AbortSignal`，用于取消请求 |
| `onProgress` | 上传进度回调；Web 端配置后会通过 XHR 发送请求 |
| `responseType` | 响应解析类型：`json`、`text`、`blob`、`blob-download`、`array-buffer` 或 `array-buffer-download` |
| `downloadName` | 下载文件名 |
| `urlCacheBusting` | 为 URL 添加缓存破坏参数 |

请求体会根据类型自动处理：当 `Content-Type` 为 JSON 时，对象会被序列化；使用 `FormData`、`URLSearchParams` 或 `Blob` 时，不要手动设置 `Content-Type`，以便运行时正确生成 multipart boundary 或内容类型。

Web 跨域访问需要服务端正确配置 CORS；若应用需要读取自定义响应 Header，服务端还应配置 `Access-Control-Expose-Headers`。

## 拦截器与工厂

每个拦截器均可独立安装和注册。例如，业务响应拦截器默认将 `code === '200'` 视为成功并提取 `data`：

```bash
pnpm add @fetchx/fetcher-interceptor-biz
```

```ts
import {
  createFetcher
} from '@fetchx/fetcher';
import interceptBiz from '@fetchx/fetcher-interceptor-biz';

const api = createFetcher({
  urlBase: 'https://api.example.com'
});

interceptBiz(api, {
  isSuccess: '0',
  getData: 'data'
});
```

常用拦截器如下：

| 包 | 作用 |
| --- | --- |
| `@fetchx/fetcher-interceptor-biz` | 判断业务响应是否成功，并抽取业务数据或错误信息 |
| `@fetchx/fetcher-interceptor-cache-local` | 使用请求配置中的 `cacheLocal` 读写本地缓存；支持 `key`、`ttl` 与 `overwrite` |
| `@fetchx/fetcher-interceptor-merging` | 合并相同请求的并发调用；可通过单次配置 `merging: false` 禁用 |
| `@fetchx/fetcher-interceptor-headers` | 追加静态或动态 Header |
| `@fetchx/fetcher-interceptor-login` | 在指定业务错误码下执行登录并重试请求 |
| `@fetchx/fetcher-interceptor-delay` | 便于开发调试的延迟拦截器；设置 `globalThis.__FETCHER_DELAY` 控制延迟 |
| `@fetchx/fetcher-interceptor-sls-core` | 将请求异常或结果上报到任意传输实现 |
| `@fetchx/fetcher-interceptor-sls` | 基于 Web SLS 日志实现的便捷上报拦截器 |

> 🚨 `merging` 与 `login` 拦截器存在已知冲突，避免在同一实例同时启用。

### Web 预设工厂

`@fetchx/fetcher-factory` 可一次性创建 Web 实例并按配置装配业务响应、缓存、Header、登录和 SLS 拦截器：

```bash
pnpm add @fetchx/fetcher-factory
```

```ts
import fetcherFactory from '@fetchx/fetcher-factory';

const api = fetcherFactory({
  urlBase: 'https://api.example.com',
  getHeaders: () => ({
    Authorization: 'Bearer <token>'
  }),
  interceptorBizOptions: {
    isSuccess: '0'
  },
  interceptorMergingOptions: true
});
```

需要 SSE 时可使用同包导出的 `fetcherSseFactory`。该工厂仅适用于 Web 端；多端应用可直接使用各个拦截器包按运行平台自行组合。

## 运行平台与传输层

### 适配器

| 包 | 适用场景 |
| --- | --- |
| `@fetchx/fetcher-core` | 不依赖具体平台的核心；传入自定义 adapter 后生成 Fetcher 工厂 |
| `@fetchx/fetcher-adapter-web` | 浏览器适配器；在 fetch、JSONP 与 XHR 上传进度之间自动选择 |
| `@fetchx/fetcher-adapter-taro` | Taro 适配器；使用前需配置小程序或应用的请求域名白名单 |
| `@fetchx/fetcher` | 默认 Web Fetcher 与 `createFetcher` |
| `@fetchx/fetcher-factory` | 预设了常用 Web 拦截器的工厂 |

核心包可用于实现其他平台的适配器，但本仓库不提供开箱即用的 Node.js adapter。

### 独立传输层

| 包 | 导出能力 |
| --- | --- |
| `@fetchx/fetcher-fetch` | 带超时支持的 `fetcherFetch` |
| `@fetchx/fetcher-jsonp` | JSONP 请求，JSONP 仅支持 GET，且不能携带 Header |
| `@fetchx/fetcher-xhr` | `fetcherXhr` 请求，可用于 XHR 和上传进度场景 |
| `@fetchx/fetch-sse` | 基于 `fetch` 的 SSE 实现，支持 Headers 与取消 |

## SSE、文件与日志

### SSE

`@fetchx/fetch-sse` 是 `EventSource` 能力基于 `fetch` 的实现，不是 `EventSource` 的 Polyfill。它可以携带自定义 Header，并提供打开、数据块、取消和完成回调：

```ts
import fetchSse from '@fetchx/fetch-sse';

const stream = fetchSse('https://api.example.com/events', {
  headers: {
    Authorization: 'Bearer <token>'
  },
  onChunk(chunk) {
    console.log(chunk);
  }
});

await stream.promise;
// 如需提前结束：stream.cancel();
```

SSE、JSONP、XHR、浏览器下载及 Web SLS 均依赖浏览器 API。

### 文件与 Header 工具

* `@fetchx/fetcher-helper-file`：上传、下载、MIME 类型与扩展名、MD5、Base64、Blob、File 转换，以及 `prepareFormData(file, fieldName?)`
* `@fetchx/fetcher-helper-headers`：Header 规范化、查询、设置、删除、合并和类型克隆等工具

### 阿里云 SLS 日志

`@fetchx/sls-logger-web` 基于 `@fetchx/sls-logger-base` 提供浏览器日志工厂。使用前需在阿里云 Logstore 中启用 Web Tracking，并提供项目、Endpoint 与 Logstore 配置。

```ts
import createLogger from '@fetchx/sls-logger-web';

const sls = createLogger({
  project: 'my-project',
  endpoint: 'cn-hangzhou.log.aliyuncs.com',
  logstore: 'my-logstore',
  defaultParams: () => ({
    UA: navigator.userAgent
  })
});

sls.info('page_view', { path: location.pathname });
sls({
  instant: true
}, 'critical_event', {
  id: '1'
});
```

日志默认先静默一段时间并批量发送，以避免与初始化阶段的业务请求竞争。使用 `{ instant: true }` 可立即上报重要日志。若在非浏览器环境中使用基础包，需要自行提供 `transport(trackUrl, body, headers)`。

## 包列表

| 分类 | 包 |
| --- | --- |
| Fetcher | `@fetchx/fetcher`、`@fetchx/fetcher-core`、`@fetchx/fetcher-factory` |
| 适配器 | `@fetchx/fetcher-adapter-web`、`@fetchx/fetcher-adapter-taro` |
| 拦截器 | `@fetchx/fetcher-interceptor-biz`、`@fetchx/fetcher-interceptor-cache-local`、`@fetchx/fetcher-interceptor-delay`、`@fetchx/fetcher-interceptor-headers`、`@fetchx/fetcher-interceptor-login`、`@fetchx/fetcher-interceptor-merging`、`@fetchx/fetcher-interceptor-sls-core`、`@fetchx/fetcher-interceptor-sls` |
| 传输层 | `@fetchx/fetcher-fetch`、`@fetchx/fetcher-jsonp`、`@fetchx/fetcher-xhr`、`@fetchx/fetch-sse` |
| 辅助工具 | `@fetchx/fetcher-helper-file`、`@fetchx/fetcher-helper-headers` |
| 日志 | `@fetchx/sls-logger-base`、`@fetchx/sls-logger-web` |

工作区目录按职责划分：

```text
packages-fetcher/    Fetcher 核心、适配器、工厂与拦截器
packages-transport/  fetch、XHR、JSONP、SSE 传输层
packages-helper/     文件与 Header 辅助方法
packages-sls/        SLS 日志基础层与 Web 实现
```

## 开发

克隆仓库后安装依赖：

```bash
pnpm install
```

常用命令：

```bash
# 代码、样式、Markdown 与 package.json 规范检查
pnpm lint
pnpm lint:style
pnpm lint:md
pnpm lint:pkg

# 构建或测试某个包
pnpm --filter @fetchx/fetcher build
pnpm --filter @fetchx/fetcher test

# 启动提供了 Storybook 脚本的包
pnpm --filter @fetchx/fetcher start

# 递归执行所有包的发布前构建
pnpm boot:packages
```

测试使用 Vitest、jsdom 和 V8 coverage。并非所有包都定义了测试或 Storybook 脚本，执行前请检查目标包的 `package.json`。

每个发布包构建后会生成以下产物：

* `dist/esm/` ESM 构建产物
* `dist/cjs/` CommonJS 构建产物
* `dist/types/` TypeScript 类型声明

提交时会通过 Husky、commitlint 与 lint-staged 执行提交信息和暂存文件检查。

## 发布

Lerna 采用独立版本管理，允许从 `main` 或 `pub` 分支发布。发布流程使用 npm，常用命令如下：

```bash
pnpm lerna:publish
pnpm lerna:publish:patch
pnpm lerna:publish:minor
pnpm lerna:publish:canary
```

发布前请先完成目标包的构建与测试，并确认各包版本及 CHANGELOG 一致。
