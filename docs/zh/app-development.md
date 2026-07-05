# 应用开发

如何向 Win12 添加新应用，以及应用可以调用的内部 API 界面。本文档记录的是
`src/js/core/registry.js` 与 `src/js/desktop.js` 中已经存在的东西——它并没有
新增 API，而是让已有的 API 变得可被发现，对应路线图中"为应用程序提供更多可
调用的 API"这一项。

## 注册表

`src/js/core/registry.js` 就是全部契约。一个应用就是一个以字符串 id 注册的
普通对象（"controller"）：

```js
// src/js/apps/example.js
(function (global) {
  var example = {
    init: function () {
      // 每次应用打开时调用（如果有 load()，则在其之后调用）
    }
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('example', example);
  } else {
    (global.apps = global.apps || {}).example = example;
  }
})(typeof window !== 'undefined' ? window : globalThis);
```

`if (global.win12 && global.win12.apps) { ... } else { ... }` 这段守卫代码之
所以存在，是因为在 `apps.js` 逐步拆分为单个应用文件的过程中，部分应用仍然
留在旧的整体文件里。请原样复制这段代码——正是它保证了无论哪种情况，
`window.apps.example` 与 `window.win12.apps.get('example')` 都指向同一个
对象。

`global.win12.apps`（也可通过 `window.win12.apps` 访问）提供：

| 方法 | 作用 |
|---|---|
| `register(name, controller)` | 新增或替换 `name` 对应的 controller。如果 `name` 不是非空字符串，或 `controller` 不是对象，将抛出异常。 |
| `get(name)` | 返回该 controller，若不存在则返回 `undefined`。 |
| `has(name)` | `name` 是否已注册。 |
| `names()` | 所有已注册的 id。 |

## Controller 生命周期

真正打开窗口的是 `openapp(name)`（`src/js/desktop.js`），它会调用你的
controller：

- **`init()`** —— 每次应用窗口打开时调用。重置该重置的内容（参见
  `calc.js`：它只是把显示屏清零）。
- **`load()`** *（可选）* —— 仅在应用首次打开时调用一次，且在 `init()` 之
  前执行。用于一次性初始化（加载 CDN 脚本、构建无需每次打开都重建的 DOM）。
  `openapp` 会通过 `apps[name].loaded` 自行追踪这一点；你不需要自己设置该
  标志。
- **`remove()`** *（可选）* —— 窗口关闭时由 `hidewin()` 调用。用于清理工作
  （例如 `camera.js` 会在这里停止视频流）。
- **`page(name)`** *（可选约定，注册表本身不强制要求）* —— 如果你的应用有
  自己的内部标签页/分区切换（参见 `setting.js` 或 `msstore.js`），这是既定
  的命名方式：隐藏当前的 `.cnt`，显示 `.cnt.{name}`，更新侧边菜单的
  `.check` 状态。

`load`/`remove`/`page` 都不是必须的——`calc.js` 只实现了 `init`。按你的应用
实际需要来添加即可。

## 将新应用接入系统

注册表只追踪 controller 对象。用户实际能看到的一切，仍需在
`src/desktop.html` 中手动接入——目前没有自动发现机制。要让一个应用可被访问，
需要添加：

1. **窗口本身** —— 在 `desktop.html` 中添加
   `<div class="window {id}">...</div>`，包含标准标题栏（`hidewin`/
   `maxwin`/`minwin` 调用，可参考任意现有应用的样板代码），以及在
   `load()` 执行期间显示的 `.loadback` 加载画面。
2. **图标** —— `src/assets/icons/{id}.svg`（或 `.png`）。如果文件名与应用
   id 不一致，需要在 `desktop.js` 的 `icon` 映射表中添加一条覆盖规则
   （`geticon(name)` 会先查这张表，查不到再回退到 `{name}.svg`）。
3. **开始菜单条目** —— 在"所有应用"列表（`#startmenu-l`）中添加一行
   `<a onclick="openapp('{id}');hide_startmenu();">`，参照已有行的写法。
4. **`taskmgrTasks` 条目** *（可选但推荐）* —— 在 `src/js/data/tasks.js`
   中添加 `{ name, icon, link: '{id}' }`。这是任务管理器所列出的内容，也
   是任务栏固定图标标题（`desktop.js` 中的 `taskbarIconTitle`）查找的来源，
   用以显示比原始 id 更友好的提示文字。
5. **Microsoft Store 目录条目** *（可选）* —— 如果该应用需要能在应用商店
   中被浏览/安装，请将其加入 `src/js/apps/msstore.js` 顶部的 `catalog`
   （或 `gameCatalog`）数组。"获取"按钮会通过已有的 `pinapp()` 将其固定到
   开始菜单。

固定到任务栏无需额外接线：任何通过 `openapp()` 打开的应用都会自动获得任务
栏图标，用户也可以自行固定/取消固定（右键点击图标，或右键点击其开始菜单
条目——参见 `desktop.js` 中的 `pinToTaskbar`/`unpinFromTaskbar`）。

## Controller 可用的其他全局对象

以下均为 `desktop.js` 中的普通顶层绑定（除非恰好是 `function` 声明，否则
并非 `window` 的属性——见下方说明），在其之后加载的任何脚本中都可以直接
以裸标识符的形式访问：

- `openapp(name)` / `hidewin(name)` / `minwin(name)` / `maxwin(name)` /
  `focwin(name)` —— 窗口生命周期。
- `pinapp(id, name, command)` / `pinToTaskbar(id)` / `unpinFromTaskbar(id)`
  —— 固定到开始菜单/任务栏。
- `geticon(name)` —— 将应用 id 解析为其图标路径。
- `lang(fallbackText, key)` —— 国际化（见下文）。这个需要特别注意：它是用
  `let` 声明的，而不是 `function`，因此它**不是** `window` 的属性。如果你
  在模块上下文中调用它（例如某个把你的应用文件当作 ES 模块导入的单元测
  试），应引用裸标识符 `lang(...)`，而不是 `global.lang(...)` /
  `window.lang(...)`——后者会抛出 `TypeError: ... is not a function`。
  `geticon` 和 `pinapp` 是 `function` 声明，因此两种写法对它们都有效，但
  裸标识符写法依然是最简单、也最符合整个代码库习惯的方式。
- `shownotice(name)` / `closenotice()` —— 模态通知系统。注意 `shownotice`
  接收的是 **`nts` 注册表中的一个键**，而不是任意文本；它不接受自由格式的
  错误字符串。
- `showcm(event, menuType, arg)` —— 右键快捷菜单。如果你的应用需要专属菜
  单，请在 `desktop.js` 的 `cms` 对象中添加新的 `menuType`。

## 本地化

所有面向用户的文本都必须通过 `lang(fallback, key)`（JS）或
`data-i18n="key"`（HTML）处理，且该键必须在 `src/lang/lang/` 下**全部五个**
语言文件（`en`、`en-US`、`zh_CN`、`zh_TW`、`tn`——即 `src/lang` git 子模块）
中都存在真实的值。`tests/unit/lang-files.test.js` 会强制校验五个语言文件间
键的完全一致，只要某个语言缺键、值为空，或者（对于 `en`/`en-US`/`tn`）出现
中日韩字符，CI 就会失败。

修改 `src/lang` 时，需要先在子模块中提交，再在主仓库中更新其指针——参见
[本地化](localization/README.md)。

## 测试约定

- **单元测试**（`tests/unit/apps-{id}.test.js`）：以 ES 模块方式导入
  `core/registry.js`，再导入你的应用文件，通过
  `window.win12.apps.get('{id}')` 获取 controller，测试那些不依赖真实
  jQuery/DOM 的方法。可参考 `apps-calc.test.js` 了解最简写法，
  `apps-msstore.test.js` 则演示了如何通过桩（stub）
  `$`/`lang`/`geticon`/`pinapp` 来测试涉及 DOM 的方法。
- **端到端测试**（`tests/e2e/*.spec.js`）：以
  `/desktop.html?skip_login=1&develop=1` 启动，通过 `page.evaluate` 调用
  `window.openapp('{id}')`，断言 `.window.{id}`。如果测试需要点击真实
  界面元素，请先隐藏登录遮罩层
  （`document.querySelector('#loginback').style.display = 'none'`），
  否则点击会被拦截。

如果你的 controller 需要与 `window.win12Native`（仅限 Tauri 的原生 API，
参见 `src/tauri/tauri_api.js`）交互，请为每次调用加上 `win12Native.isTauri()`
守卫，并让 Web 版本保持惰性、明确提示"仅桌面版可用"，与 `tauri_api.js` 中的
`checkAppUpdate`/`getAutostart`、以及 `setting.js` 中的
`checkUpdate`/`initAutostart` 保持一致。
