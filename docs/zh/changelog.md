# 更新记录

> 🌐 English: [../en/changelog.md](../en/changelog.md)

本页记录**本分支**的重要变更。完整的上游历史见根目录
[`changelog.md`](../../changelog.md)（中文）以及应用内的“关于 Windows 12 网页版”。

---

## 分支 —— 2026-06

为使本分支运行时回归参考设计并补充工具链而进行的稳定化工作。详细复盘见
[`../learning/`](../../.claude/internal-affairs/learning/README.md)。

- **登录/桌面** —— 恢复参考设计：桌面始终构建并可见；`#loginback` 为登录后淡出的覆盖层
  （移除了隐藏桌面的 CSS，以及导致覆盖层无法隐藏的 `!important`）。将
  `win12FinishLogin()` 还原为仅淡出覆盖层。
- **开机顺序** —— `index.html` 现为干净的整页重定向到 `boot.html`（移除了导致桌面重复
  加载的 iframe + 竞争性 5 秒定时器）。
- **Service Worker** —— 将 `public/sw.js` 重写为网络优先 + 带版本号的缓存、
  `skipWaiting()` / `clients.claim()`，并使用 `cache: 'reload'`，使改动始终生效
  （不再跨浏览器出现过期文件）。
- **资源** —— 恢复缺失的 `login.jpg`、`folder.png`、`office-newfile.png`；修复
  `bootstrap-icons` 的 `@font-face` 路径（`./fonts/` → `../assets/fonts/`），使所有 `bi`
  图标正常渲染，而非显示为空白方块（豆腐块）。
- **工具** —— 新增 [`docs/sync/`](../sync/README.zh-CN.md)：参考项目 ↔ 分支的路径映射，
  以及用于合并上游变更的 `compare.mjs`（`npm run compare`）。
- **本地化（2026-06-23）** —— 完整的多语言界面。将约 230 个硬编码字符串接入 `data-i18n`
  键（设置、任务管理器、Word、Defender、记事本、白板、关于）；新增**茨瓦纳语（Setswana）**
  翻译及登录选择器条目；使 `en`、`en-US`、`zh_CN`、`zh_TW`、`tn` 达到完全对齐（**各 566 个键**）。
  修复了启动逻辑，使 **zh-CN 现在会加载其翻译文件**（此前从不加载，导致简体中文显示为
  错乱文本），并将 `lang/` 移入 `public/lang/` 以便文件可被正常提供。i18n 工具位于 `docs/sync/`。
- **文档** —— 新增多语言文档集：English、中文、Français、Setswana。

---

## 上游

上游版本历史（v1.0.0 → v7.4.2 及之后）由 `win12-online/win12` 维护，记录在根目录
`changelog.md` 及应用内“关于”页面中。
