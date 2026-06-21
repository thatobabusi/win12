# Win12 Documentation Hub

Complete documentation for the Win12 Online project.

## 📚 Documentation Structure

### English Documentation (English)

**Testing & Development**
- **[Testing Guide](en/testing/)** - Complete testing documentation
  - [Quick Start](en/testing/QUICKSTART.md) - Get started in 5 minutes
  - [Docker Testing](en/testing/DOCKER.md) - Testing with Docker containers
  
- **[Contributing Guide](en/contributing/README.md)** - How to contribute with testing requirements

**Project Guidelines**
- **[Localization Guide](en/localization/README.md)** - Engineering guide for multi-language support
  - Translation architecture and best practices
  - `data-i18n` patterns and JavaScript translation
  - Settings app localization requirements
  - Tauri and web parity

### 中文文档 (Mandarin Chinese)

**测试与开发**
- **[测试指南](zh/testing/)** - 完整的测试文档
  - [快速入门](zh/testing/QUICKSTART.md) - 5分钟快速开始
  - [Docker 测试](zh/testing/DOCKER.md) - 使用 Docker 进行测试

- **[贡献指南](zh/contributing/README.md)** - 贡献指南和测试要求

**项目指南**
- **[本地化指南](zh/localization/README.md)** - 多语言支持工程指南
  - 翻译架构和最佳实践
  - `data-i18n` 模式和 JavaScript 翻译
  - Settings 应用本地化要求
  - Tauri 和 Web 一致性

## 🔍 Quick Navigation

### Starting Out?
- 👉 [English Quick Start](en/testing/QUICKSTART.md)
- 👉 [中文快速入门](zh/testing/QUICKSTART.md)

### Want to Contribute?
- 👉 [English Contributing Guide](en/contributing/README.md)
- 👉 [中文贡献指南](zh/contributing/README.md)

### Implementing Features?
- 👉 [English Localization Guide](en/localization/README.md)
- 👉 [中文本地化指南](zh/localization/README.md)

## 📂 Complete Folder Structure

```
docs/
├── README.md (this file)
├── en/
│   ├── testing/
│   │   ├── README.md          - Testing overview
│   │   ├── QUICKSTART.md      - 5-minute quick start
│   │   └── DOCKER.md          - Docker testing guide
│   ├── contributing/
│   │   └── README.md          - Contributing guidelines
│   └── localization/
│       └── README.md          - Localization engineering guide
├── zh/
│   ├── testing/
│   │   ├── README.md          - 测试指南概述
│   │   ├── QUICKSTART.md      - 快速入门指南
│   │   └── DOCKER.md          - Docker 测试指南
│   ├── contributing/
│   │   └── README.md          - 贡献指南
│   └── localization/
│       └── README.md          - 本地化指南
├── english/                   - Legacy (kept for backwards compatibility)
├── mandarin/                  - Legacy (kept for backwards compatibility)
└── ...
```

## 🌍 Language Support

This project provides comprehensive documentation in:
- 🇬🇧 **English** - Complete documentation in `docs/en/`
- 🇨🇳 **Mandarin Chinese (中文)** - Complete documentation in `docs/zh/`

## 📝 Key Guidelines

### All UI Work Must Be Localized

All user-facing UI text must be designed with language switching in mind:
- New text must be wired through translation keys
- Keep translations in sync across supported language files (`lang_en.properties`, `lang_en-US.properties`, `lang_zh_CN.properties`, `lang_zh_TW.properties`)
- Use `data-i18n` for HTML text, `lang()` for JavaScript-generated text

See [Localization Guide](en/localization/README.md) or [本地化指南](zh/localization/README.md) for details.

### Testing is Required

All changes must have accompanying tests:
- Unit tests for logic and modules
- Linting checks for code quality
- E2E tests for user workflows (run locally)

See [Testing Guide](en/testing/QUICKSTART.md) or [测试指南](zh/testing/QUICKSTART.md) for details.

## 🔗 Related Files

- **[Main README](../README.md)** - Project overview
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Root-level contributing guidelines (legacy)
- **[changelog.md](../changelog.md)** - Project changelog
- **[CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)** - Code of conduct

## 📞 Questions?

- Check the relevant guide above
- Review examples in existing code
- Create an issue on GitHub for questions
