# Windows 12 网页版

> 🌐 English: [../en/index.md](../en/index.md)

一个基于浏览器的 **Windows 12 模拟系统**——完整的桌面环境（开机流程、登录、任务栏、
窗口、应用、右键菜单），完全在浏览器中运行，并可选用 Tauri 打包为桌面应用。本仓库是
上游 `win12-online/win12` 项目的定制分支；它在目录结构上已经分叉，并新增了多语言支持、
Docker 与测试套件。

---

## 包含内容

| 模块 | 说明 |
|------|------|
| **开机流程** | `index.html` → `boot.html`（BIOS 风格进度条，F2 → `bios.html`）→ `desktop.html` |
| **桌面** | 始终构建好的桌面，包含图标、任务栏 Dock、可拖动窗口、右键菜单 |
| **登录** | `#loginback` 覆盖层，登录后淡出以显示其下方的桌面 |
| **应用** | 设置、文件资源管理器、Edge、计算器、记事本、终端、商店、相机、白板等 |
| **国际化（i18n）** | `public/lang/` 属性文件 + `data-i18n` 属性；英文、简体中文、繁体中文、**茨瓦纳语（Setswana）**——均完全对齐（各 566 个键）；通过登录选择器切换 |
| **PWA** | `pwa/manifest.json` + Service Worker（`public/sw.js`），支持离线/可安装 |
| **Tauri** | `public/tauri/` 垫片，用于作为原生桌面应用运行 |
| **测试** | Vitest（单元）+ Playwright（端到端），配置位于 `config/` |

---

## 文档导航

| 文档 | 用途 |
|------|------|
| [安装](installation.md) | 在本地运行 win12（Herd、Docker 或任意静态服务器） |
| [配置](configuration.md) | 语言、开发模式、Service Worker、主题 |
| [架构](architecture.md) | 开机顺序、登录覆盖层、Service Worker——运行时如何协同 |
| [使用](usage.md) | 使用桌面：开机、登录、应用、菜单 |
| [测试](testing/README.md) | 单元测试 + 端到端测试 |
| [贡献](contributing/README.md) | 如何参与贡献 |
| [本地化](localization/README.md) | 多语言工程指南 |
| [更新记录](changelog.md) | 重要变更 |
| [许可证](license.md) | 授权许可（EPL-2.0 + CC） |

维护者还可参考 `../sync/`（参考项目 ↔ 本分支对比工具）与 `../learning/`（工程复盘）。

---

## 快速开始

```bash
# 由 Laravel Herd 从 public/ 提供服务，地址 https://win12.test
# 或从 public/ 目录运行任意静态服务器，例如：
cd public && npx serve .
```

打开站点根地址，开机流程会自动运行。完整选项见[安装](installation.md)。

---

## 项目结构（概览）

```
win12/
├── public/              # 网站根目录（由 Herd / 静态服务器提供）
│   ├── index.html       # 入口 → 重定向到 boot.html
│   ├── boot.html        # BIOS 开机界面（boot_kernel.js）
│   ├── bios.html        # SETUP 界面（开机时按 F2）
│   ├── desktop.html     # 桌面 + 登录覆盖层
│   ├── src/             # desktop.js、modules/、data/、games/
│   ├── styles/          # base.css、desktop.css、bootstrap-icons.css
│   ├── scripts/         # jq、内核脚本、辅助脚本
│   ├── assets/          # 图标、图片、字体、媒体
│   ├── apps/            # 各应用的样式 + 图标
│   ├── tauri/           # Tauri 垫片
│   ├── lang/            # i18n 属性文件（en、en-US、zh_CN、zh_TW、tn）——已提供服务
│   ├── pwa/             # manifest + logo（已提供服务；可安装的 PWA）
│   └── sw.js            # Service Worker（网络优先、带版本号）
├── config/             # vitest / playwright / eslint 配置
├── tests/               # 单元 + 端到端测试
└── docs/                # 本文档（en/ + zh/ + fr/ + tn/）
```
