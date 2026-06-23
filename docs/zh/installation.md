# 安装

> 🌐 English: [../en/installation.md](../en/installation.md)

win12 是一个静态前端应用。**网站根目录是 `public/`**——无论用什么方式提供服务，都应指向
`public/`，而不是仓库根目录。

---

## 方式一 —— Laravel Herd（本机推荐）

Herd 会自动从 `public/` 提供服务。

1. 确保站点已在 Herd 中链接/停放（linked/parked）。
2. 打开 **https://win12.test/**。

开机流程会自动开始，无需任何构建步骤。

---

## 方式二 —— 任意静态服务器

```bash
cd public

# 任选其一：
npx serve .            # Node
python -m http.server  # Python 3
php -S localhost:8000  # PHP
```

然后打开所提供的根地址（例如 `http://localhost:3000/`）。

> ⚠️ 一定要从 **`public/` 内部**提供服务。从仓库根目录提供服务会导致应用资源 404，
> 因为所有路径都是相对于 `public/` 的。

---

## 方式三 —— Docker

仓库提供了 `Dockerfile` 和 `docker-compose.yml`。

```bash
docker compose up --build
```

这会在容器中通过 HTTP 提供 `public/`。发布端口见 `docker-compose.yml`。

---

## 验证安装

你应当依次看到：

1. 黑色**开机界面**，带有 “Starting” 进度条（约 2 秒）。
2. **登录界面**（不透明壁纸、“Administrator”、登录按钮）。
3. 点击**登录**后，覆盖层淡出，显示带图标、且右键菜单可用的**桌面**。

如果资源看起来异常（图标缺失、登录透明），几乎总是 **Service Worker 缓存过期**所致——
见[配置 → Service Worker](configuration.md#service-worker)。

---

## 环境要求

- 现代浏览器（Chromium、Firefox 或 WebKit）。
- 仅在运行测试套件或 `compare` 工具时才需要 Node.js。
- 可选：用于提供服务的 Laravel Herd 或 Docker。
