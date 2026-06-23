# 配置

> 🌐 English: [../en/configuration.md](../en/configuration.md)

win12 没有构建配置；运行时行为由 URL 参数、`localStorage` 以及少量源文件控制。

---

## 语言

界面语言依次从 `localStorage.lang`、浏览器语言、英文中解析。用户可在登录界面的语言列表中
切换，或直接设置：

```js
localStorage.setItem('lang', 'en');   // 'en' | 'en-US' | 'zh-CN' | 'zh-TW' | 'tn'
location.reload();
```

翻译位于 `lang/lang/*.properties`，并通过 `data-i18n` 属性应用。详见
[本地化指南](localization/README.md)。

---

## URL 参数

| 参数 | 作用 |
|------|------|
| `?develop=1` | **跳过 Service Worker 注册**——始终加载最新文件。编辑代码时使用。 |
| `?skip_login=1` | 跳过登录覆盖层，直接进入桌面。 |

示例：`https://win12.test/desktop.html?develop=1`

---

## Service Worker

`public/sw.js` 采用**网络优先 + 版本号**策略：

- 始终先尝试请求线上文件，仅在离线时回退到缓存；并使用
  `fetch(req, { cache: 'reload' })`，使浏览器自身的 HTTP 缓存无法返回过期副本。
- 缓存名称带有版本号（`CACHE_VERSION`）；每次更改 Worker 行为时递增它，旧缓存会在
  activate 时清除。
- `skipWaiting()` + `clients.claim()` 让新 Worker 立即接管。

**如果改动没有生效：** 仍在运行旧 Worker 的浏览器需要刷新约 2 次（第一次安装新 Worker，
第二次提供最新文件）。要从页面控制台强制清空缓存：

```js
navigator.serviceWorker.controller?.postMessage({ head: 'update' });
```

开发时也可使用 `?develop=1` 进行无 Worker 加载。

---

## 主题

明/暗与强调色选项由桌面界面（设置应用）处理，并保存在 `localStorage` 中。登录/桌面壁纸
位于 `public/assets/images/`（`login.jpg`、`bg.svg`、`bg-dark.svg`）。

---

## Tauri（桌面构建）

`public/tauri/` 包含垫片（`tauri_api.js`、`Battery_power.js`），应用会对其进行特性检测。
当不在 Tauri 下运行时它们处于惰性状态，因此同一套代码可在网页上运行。
