# Win12 Documentation Hub

Complete documentation for the Win12 Online project, in **English**, **中文**, **Français**, and **Setswana**.

Start here: **[English overview](en/index.md)** · **[中文总览](zh/index.md)** · **[Aperçu en français](fr/index.md)** · **[Tshobokanyo ya Setswana](tn/index.md)**

---

## 📚 Documentation

| Topic | English | 中文 | Français | Setswana |
|-------|---------|------|----------|----------|
| Overview | [index](en/index.md) | [总览](zh/index.md) | [index](fr/index.md) | [tshobokanyo](tn/index.md) |
| Installation | [installation](en/installation.md) | [安装](zh/installation.md) | [installation](fr/installation.md) | [go tsenya](tn/installation.md) |
| Configuration | [configuration](en/configuration.md) | [配置](zh/configuration.md) | [configuration](fr/configuration.md) | [thulaganyo](tn/configuration.md) |
| Architecture | [architecture](en/architecture.md) | [架构](zh/architecture.md) | [architecture](fr/architecture.md) | [moago](tn/architecture.md) |
| Usage | [usage](en/usage.md) | [使用](zh/usage.md) | [utilisation](fr/usage.md) | [tiriso](tn/usage.md) |
| Testing | [testing](en/testing/README.md) | [测试](zh/testing/README.md) | [tests](fr/testing/README.md) | [diteko](tn/testing/README.md) |
| Contributing | [contributing](en/contributing/README.md) | [贡献](zh/contributing/README.md) | [contribution](fr/contributing/README.md) | [go nna le seabe](tn/contributing/README.md) |
| Localization | [localization](en/localization/README.md) | [本地化](zh/localization/README.md) | [localisation](fr/localization/README.md) | [localization](tn/localization/README.md) |
| Changelog | [changelog](en/changelog.md) | [更新记录](zh/changelog.md) | [journal](fr/changelog.md) | [lonaane lwa diphetogo](tn/changelog.md) |
| License | [license](en/license.md) | [许可证](zh/license.md) | [licence](fr/license.md) | [laesense](tn/license.md) |

### Maintainer references (English)

- **[sync/](sync/README.md)** ([中文](sync/README_zh.md)) — reference↔fork path
  map + `compare.mjs` for incorporating upstream changes (`npm run compare`).
- **[learning/](../.claude/internal-affairs/learning/README.md)** — engineering post-mortems (boot / login /
  service-worker saga). Read before re-touching those flows.

---

## 🔍 Quick navigation

- **New here?** → [English overview](en/index.md) / [中文总览](zh/index.md) / [Aperçu FR](fr/index.md)
- **Get it running?** → [Installation](en/installation.md) / [安装](zh/installation.md) / [Installation FR](fr/installation.md)
- **Changes not showing up?** → [Configuration → Service worker](en/configuration.md#service-worker)
- **Want to contribute?** → [Contributing](en/contributing/README.md) / [贡献](zh/contributing/README.md)
- **Adding UI text?** → [Localization](en/localization/README.md) / [本地化](zh/localization/README.md)

---

## 📂 Folder structure

```
docs/
├── README.md            (this hub)
├── en/                  English docs
│   ├── index.md         overview
│   ├── installation.md
│   ├── configuration.md
│   ├── architecture.md
│   ├── usage.md
│   ├── changelog.md
│   ├── license.md
│   ├── testing/         README, QUICKSTART, DOCKER
│   ├── contributing/    README
│   └── localization/    README
├── zh/                  中文文档（与 en/ 结构镜像）
│   └── …                index, installation, configuration, architecture, usage, changelog, license, testing/, contributing/, localization/
├── fr/                  Documentation française (miroir de en/)
│   └── …                index, installation, configuration, architecture, usage, changelog, license, testing/, contributing/, localization/
├── tn/                  Ditokomane tsa Setswana (e tshwana le en/)
│   └── …                index, installation, configuration, architecture, usage, changelog, license, testing/, contributing/, localization/
├── sync/                reference↔fork comparison tool (compare.mjs, path-map.json, REPORT.md)
└── learning/            engineering post-mortems
```

---

## 📝 Key guidelines

### All UI work must be localized

User-facing text must be designed for language switching:
- Wire new text through translation keys (`data-i18n` for HTML, `lang()` for JS).
- Keep `lang/lang/*.properties` in sync (`lang_en`, `lang_en-US`, `lang_zh_CN`, `lang_zh_TW`).

See [Localization](en/localization/README.md) / [本地化](zh/localization/README.md).

### Testing

Changes should ship with tests — unit (Vitest), lint (ESLint), and e2e (Playwright).
See [Testing](en/testing/README.md) / [测试](zh/testing/README.md).

---

## 🔗 Related files

- [CREDITS](en/CREDITS.md) · [简体中文](zh/CREDITS_zh.md) · [Setswana](tn/CREDITS_tn.md) — attribution to the original authors of Windows 12 Online
- [Main README](zh/README_zh.md) — project overview
- Legacy language selector READMEs (moved from the old `readme/` folder): [English](en/README_en.md) · [Français](fr/README_fr.md) · [繁體中文](zh/README_zh_tw.md)
- [CONTRIBUTING_upstream.md](zh/CONTRIBUTING_upstream.md) — root contributing notes
- [changelog_upstream.md](zh/changelog_upstream.md) — upstream changelog (Chinese)
- [LICENSE](en/LICENSE) · [LICENSE-CC](zh/LICENSE-CC) — licensing
- [CODE_OF_CONDUCT.md](zh/CODE_OF_CONDUCT.md)
