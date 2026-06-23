# 参考项目 ↔ WIP 项目 同步与对比

> 🌐 English version: [README.md](README.md)

本目录提供工具，用于**映射并对比**上游**参考项目**（`win12-online/win12`，检出于
`Tools/win12-git`）与本**WIP（开发中）项目**——后者在内容和目录结构上都已偏离上游。

**为什么需要它：** 你已经对项目做了定制，并且今后会持续从上游拉取新内容。由于两个仓库的
目录结构不同，直接 `diff -r` 毫无意义——必须先把文件**对齐**。本工具完成对齐后，会准确
告诉你：哪些文件完全一致、哪些被你改动过、以及上游有而你没有的文件。

它还会统计共享源码文件中**残留了多少硬编码中文**，让你能用数据向上游论证：应改用
多语言（语言键 language-key）方案，而不是只用中文字符串。

---

## 文件说明

| 文件 | 用途 |
|------|------|
| `path-map.json` | 映射规则：参考项目路径 → WIP 路径。上游新增顶层文件/目录时**编辑此文件**。 |
| `compare.mjs` | 对比脚本（Node，无依赖）。 |
| `REPORT.md` | 生成的报告。每次运行都会覆盖——请勿手动编辑。 |
| `README.md` / `README.zh-CN.md` | 本说明文档（英文 / 中文）。 |

---

## 目录结构差异（为何需要映射）

| 参考项目（扁平结构） | 本 WIP 项目 |
|----------------------|-------------|
| `desktop.js` | `public/src/desktop.js` |
| `desktop.css`、`base.css`、`bootstrap-icons.css` | `public/styles/…` |
| `module/` | `public/src/modules/` |
| `scripts/` | `public/scripts/` |
| `icon/` | `public/assets/icons/` |
| `img/` | `public/assets/images/` |
| `fonts/`、`media/` | `public/assets/…` |
| `data/`、`games/` | `public/src/…` |
| `*.html` | `public/*.html` |
| `apps/`、`tauri/` | `public/apps/`、`public/tauri/` |
| `lang/`、`pwa/` | `lang/`、`pwa/`（目前在顶层——见下方注意事项） |

完整且权威的列表见 `path-map.json`。

---

## 运行方式

```bash
# 在项目根目录下执行
node docs/sync/compare.mjs

# 指定另一个参考项目的检出路径
node docs/sync/compare.mjs --ref="D:/path/to/win12-git"
# 或
WIN12_REF="D:/path/to/win12-git" node docs/sync/compare.mjs

# 在报告中同时列出完全一致（IDENTICAL）的文件
node docs/sync/compare.mjs --full

# 将报告输出到其他位置
node docs/sync/compare.mjs --report=docs/sync/REPORT.md
```

若已添加 npm 脚本（见下文）：

```bash
npm run compare
npm run compare -- --full
```

默认参考路径为 `D:/My Software Dev/Tools/win12-git`。

---

## 如何阅读报告

`REPORT.md` 会把每个已对齐的文件归入以下类别之一：

| 类别 | 含义 | 应对方式 |
|------|------|----------|
| **IDENTICAL** | 逐字节完全一致 | 无需处理 |
| **MODIFIED** | 两边都存在但已分叉 | **拉取上游时，手动把上游改动合并进你的版本** |
| **MISSING_IN_WIP** | 上游有、你没有 | 新增/更新的上游文件——复制到映射的 WIP 路径 |
| **WIP_ONLY** | 你新增的、上游没有 | 仅作参考（你的成果） |
| **UNMAPPED** | 参考项目顶层条目无对应规则 | 在 `path-map.json` 中新增规则 |

---

## 上游同步工作流（当上游推送新内容时）

1. 更新参考检出：`cd Tools/win12-git && git pull`。
2. 重新运行：`node docs/sync/compare.mjs`。
3. 打开 `REPORT.md`，自上而下处理：
   - **MISSING_IN_WIP** → 这些是新的上游文件。按表中所示的 WIP 路径逐一复制。
   - **MODIFIED** → 上游改动了你也定制过的文件。打开两边，把上游改动合并进你的版本，
     同时保留你的定制。
   - **UNMAPPED** → 上游新增了顶层路径。添加一条映射规则后重新运行。
4. 反复运行，直到只剩下你**有意保留**的 MODIFIED / WIP_ONLY 条目。

---

## 多语言（i18n）论证

报告中的 **i18n / multilingual signal**（多语言信号）部分会统计共享 `.js` / `.html`
文件中硬编码的中文（CJK）字符数量，并对比参考项目与 WIP。用它来：

- 量化上游硬编码了多少中文字符串（例如 `desktop.html`、`desktop.js`、`module/apps.js`）。
- 证明你的版本已把这些字符串迁移到语言键（你的 `lang/lang/` 新增了
  `lang_en.properties` / `lang_en-US.properties`），从而无需改动源码即可用英文渲染同一界面。
- 在提议变更时直接指向具体文件，而不是空泛地争论。

---

## ⚠️ 注意：发现的服务（serving）问题（`lang/` 与 `pwa/`）

本项目由 Herd 从 `public/` 目录提供服务，但 `lang/` 与 `pwa/` 目前位于**仓库顶层**，
而非 `public/` 之下。应用会请求 `/lang/…` 和 `/pwa/manifest.json`，这些路径会落到
`public/` 内并返回 404。路径映射已指向它们的真实（顶层）位置，以便对比仍能正常工作；
但**若要像参考项目那样正确提供服务，应把这些目录移动到 `public/` 下**（或通过构建步骤
复制过去）。此问题由本工具发现，并未自动修复。
