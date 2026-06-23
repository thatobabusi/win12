# 架构

> 🌐 English: [../en/architecture.md](../en/architecture.md)

win12 运行时如何协同工作。本设计与上游参考项目保持一致——如有疑问，参考项目
（`win12-online/win12`）为准。

---

## 开机顺序

```
index.html ──（整页重定向）──▶ boot.html ──（boot_kernel.js，约 2 秒）──▶ desktop.html ──▶ 登录覆盖层 ──▶ 桌面
                                  │
                              F2 / 触摸
                                  ▼
                              bios.html ──（bios_kernel.js）──▶ boot.html
```

- **`index.html`** 只做一件事：整页重定向到 `boot.html`。它**不得**使用 iframe 或自带定时器
  ——那会导致重复加载。
- **`boot.html`** 运行 `scripts/boot_kernel.js`，填充进度条
  （`[0,0,1,3,7,17,20]` × 300ms ≈ 2 秒），随后跳转到 `desktop.html`。
  按 **F2**（或触摸）进入 `bios.html`。
- **`bios.html`** 运行 `scripts/bios_kernel.js`，再返回 `boot.html`。

---

## 登录覆盖层

登录是**位于已构建好的桌面之上的覆盖层**——而非一道门禁。

- `#desktop` 始终为 `display:flex`，其图标/菜单在启动时由 `src/desktop.js` 中的
  `setIcon()` / `addMenu()` 构建。
- `#loginback`（z-index 101）初始隐藏（`opacity:0; display:none`），并在启动时于
  `skip_login != 1` 时升起。
- `win12FinishLogin()` 只**让覆盖层淡出**（`display:none`）。它**不得**构建或切换桌面，
  且覆盖层**不得**使用 `display:flex !important`（那会导致无法隐藏）。

这正是覆盖层淡出后图标和菜单立即可用的原因：它们一直处于活动状态，只是被遮住了。

---

## Service Worker

`public/sw.js` 采用**网络优先** + 带版本号的缓存，并使用 `skipWaiting()` 与
`clients.claim()`。运行细节见
[配置 → Service Worker](configuration.md#service-worker)。核心原则：在活跃开发期间，
新鲜度优先于缓存——Worker 在每次同源 GET 时都会绕过其自身缓存与浏览器 HTTP 缓存。

---

## 目录结构与参考项目

本项目把参考项目的扁平结构重组为 `public/` + `src` / `styles` / `assets`。映射关系
（参考 → 本项目）与对比工具见 [`../sync/`](../sync/README.zh-CN.md)：

| 参考项目 | 本项目 |
|----------|--------|
| `desktop.js` | `public/src/desktop.js` |
| `module/` | `public/src/modules/` |
| `icon/`、`img/` | `public/assets/icons/`、`public/assets/images/` |
| `*.css` | `public/styles/` |
| `*.html` | `public/*.html` |

运行 `npm run compare` 即可准确查看本分支与上游的差异，以及上游拉取后需要合并的内容。

---

## 经验教训

真实的工程复盘（开机/登录/Service Worker 的曲折历程）见
[`../learning/`](../../.claude/internal-affairs/learning/README.md)。在再次改动开机或登录流程之前请先阅读。
