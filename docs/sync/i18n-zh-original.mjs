#!/usr/bin/env node
/*
 * i18n-zh-original.mjs — fill the pre-existing upstream Chinese gaps so zh_CN and
 * zh_TW reach full parity with en/tn (566 keys). Idempotent (skips existing).
 * zh_TW values are Traditional Chinese (machine-assisted; native review advised).
 * Run: node docs/sync/i18n-zh-original.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const LANG = resolve(here, '..', '..', 'public', 'lang', 'lang');

// key: [zh_CN, zh_TW]
const ZH = {
  'setting.update.not-complete': ['开发者暂未完善此功能', '開發者暫未完善此功能'],
  'setting.update.disabled': ['Windows 更新已被禁用', 'Windows 更新已被停用'],
  'setting.password.tauri-only': ['仅 Tauri App 可用', '僅 Tauri App 可用'],
  'setting.password.is-set': ['已设置密码', '已設定密碼'],
  'setting.password.not-set': ['未设置密码', '未設定密碼'],
  'setting.password.new': ['新密码', '新密碼'],
  'setting.password.new-clear': ['新密码（留空清除密码）', '新密碼（留空清除密碼）'],
  'setting.password.enter-new': ['请输入新密码', '請輸入新密碼'],
  'setting.password.enter-current': ['请输入当前密码', '請輸入目前密碼'],
  'setting.password.clearing': ['正在清除', '正在清除'],
  'setting.password.saving': ['正在保存', '正在儲存'],
  'setting.password.cleared': ['密码已清空', '密碼已清空'],
  'setting.password.saved': ['密码已保存', '密碼已儲存'],
  'edge.name': ['Microsoft Edge', 'Microsoft Edge'],
  'edge.newtab': ['新建标签页', '開新分頁'],
  'explorer.devices': ['设备和驱动器', '裝置和磁碟機'],
  'explorer.localdisk': ['本地磁盘', '本機磁碟'],
  'explorer.available': ['可用', '可用'],
  'explorer.total': ['共', '共'],
  'explorer.localfolder': ['本地文件夹', '本機資料夾'],
  'explorer.loading': ['加载中...', '載入中...'],
  'explorer.cannotread': ['无法读取此文件夹。', '無法讀取此資料夾。'],
  'explorer.empty': ['此文件夹为空。', '此資料夾為空。'],
  'explorer.filenotfound': ['Windows 找不到文件', 'Windows 找不到檔案'],
  'explorer.filenotfound-verify': ['请确定文件名是否正确后，再试一次。', '請確定檔案名稱是否正確後，再試一次。'],
  'explorer.filenotfound-search': ['在 Microsoft Edge 中搜索', '在 Microsoft Edge 中搜尋'],
  'code-editor.goto-line': ['跳转到行', '跳至行'],
  'code-editor.status': ['行 %line, 列 %column', '行 %line, 列 %column'],
  'code-editor.status-selected': ['行 %line, 列 %column (已选 %chars 字符)', '行 %line, 列 %column (已選 %chars 字元)'],
  'code-editor.spaces': ['空格', '空格'],
  'code-editor.tab': ['Tab', 'Tab'],
  'notepad.size.1': ['初号', '初號'],
  'notepad.size.2': ['小初', '小初'],
  'notepad.size.3': ['一号', '一號'],
  'notepad.size.4': ['小一', '小一'],
  'notepad.size.5': ['二号', '二號'],
  'notepad.size.6': ['小二', '小二'],
  'notepad.size.7': ['三号', '三號'],
  'notepad.size.8': ['小三', '小三'],
  'notepad.size.9': ['四号', '四號'],
  'notepad.size.10': ['小四', '小四'],
  'notepad.size.11': ['五号', '五號'],
  'notepad.size.12': ['小五', '小五'],
  'notepad.style.normal': ['正常', '正常'],
  'notepad.style.bold': ['粗体', '粗體'],
  'notepad.style.italic': ['斜体', '斜體'],
  'notepad.style.bold-italic': ['粗偏斜体', '粗斜體'],
  'about.refresh': ['刷新', '重新整理'],
  'about.contributed': ['贡献', '貢獻'],
  'terminal.version': ['Microsoft Windows [版本 12.0.39035.7324]', 'Microsoft Windows [版本 12.0.39035.7324]'],
  'terminal.copyright': ['(c) Microsoft Corporation。保留所有权利。', '(c) Microsoft Corporation。著作權所有，並保留一切權利。'],
  'terminal.not-found': ['"%s" 不是内部或外部命令，也不是可运行的程序或批处理文件。', '"%s" 不是內部或外部命令，也不是可執行的程式或批次檔。'],
  'taskmgr.virus-attacks': ['病毒攻击次数', '病毒攻擊次數'],
  'taskmgr.priority.very-low': ['非常低', '非常低'],
  'taskmgr.priority.low': ['低', '低'],
  'taskmgr.priority.medium': ['中', '中'],
  'taskmgr.disk-latency': ['毫秒', '毫秒'],
  'taskmgr.disk-speed-mb': ['MB/秒', 'MB/秒'],
  'taskmgr.disk-speed-kb': ['KB/秒', 'KB/秒'],
  'taskmgr.wifi-stats': ['发送：%send 接收：%receive Mbps', '傳送：%send 接收：%receive Mbps'],
  'taskmgr.cpu-usage': ['CPU 利用率', 'CPU 使用率'],
  'battery.loading': ['正在获取电池信息...', '正在取得電池資訊...'],
  'login.password': ['密码', '密碼'],
  'login.unable-read-status': ['无法读取本地密码状态', '無法讀取本機密碼狀態'],
  'login.please-enter-password': ['请输入密码', '請輸入密碼'],
  'login.verifying': ['正在验证', '正在驗證'],
  'login.incorrect': ['密码错误', '密碼錯誤'],
  'easter.bug-found': ['恭喜你发现了这个 bug,但是太懒了不想修 qwq', '恭喜你發現了這個 bug，但是太懶了不想修 qwq'],
  'page.boot-title': ['Windows 12 网页版 - 网络连接问题解决方案', 'Windows 12 網頁版 - 網路連線問題解決方案'],
  'page.disconnected-title': ['Windows 12 网页版 - 网络连接问题解决方案', 'Windows 12 網頁版 - 網路連線問題解決方案'],
  'page.disconnected-desc': ['Windows 12 网页版网络连接问题解决方案。提供关于网络连接的帮助和建议。', 'Windows 12 網頁版網路連線問題解決方案。提供關於網路連線的協助和建議。'],
  'page.boot-back-online': ['返回在线', '返回連線'],
  'page.boot-network-issue': ['网络连接问题', '網路連線問題'],
  'page.disconnected-desc-full': ['您似乎已断开网络连接。网络因您而与众不同。让我们帮您重新上线！', '您似乎已中斷網路連線。網路因您而與眾不同。讓我們協助您重新上線！'],
  'page.disconnected-check-cables': ['检查网络电缆、调制解调器和路由器', '檢查網路纜線、數據機和路由器'],
  'page.disconnected-reconnect-wifi': ['重新连接到无线网络', '重新連線到無線網路'],
  'page.disconnected-error-code': ['错误代码：ERR_INTERNET_DISCONNECTED', '錯誤代碼：ERR_INTERNET_DISCONNECTED'],
  'page.disconnected-error-desc': ['此错误表示您的设备已与 Internet 断开连接。请检查网络连接设备，例如网络电缆是否正确连接、Wi-Fi 是否连接正常或移动网络是否已打开，以确保您的设备能够正常访问 Internet。', '此錯誤表示您的裝置已與 Internet 中斷連線。請檢查網路連線裝置，例如網路纜線是否正確連接、Wi-Fi 是否連線正常或行動網路是否已開啟，以確保您的裝置能夠正常存取 Internet。'],
  'page.reload-status': ['正在重启', '正在重新啟動'],
  'page.shutdown-status': ['正在关机', '正在關機'],
  'page.shutdown-boot-instruction': ['按 Enter 键开机。', '按 Enter 鍵開機。'],
  'page.shutdown-title': ['已关机', '已關機'],
  'game.minesweeper.difficulty.easy': ['简单 (9x9, 10 雷)', '簡單 (9x9, 10 雷)'],
  'game.minesweeper.difficulty.normal': ['中等', '中等'],
  'game.minesweeper.difficulty.hard': ['困难', '困難'],
  'game.minesweeper.rows': ['行数', '列數'],
  'game.minesweeper.cols': ['列数', '欄數'],
  'game.minesweeper.mines': ['雷数', '地雷數'],
  'game.minesweeper.language.en': ['English', 'English'],
  'game.minesweeper.language.zh': ['简体中文', '繁體中文'],
  'game.minesweeper.gameover': ['游戏结束', '遊戲結束'],
  'game.minesweeper.restart': ['重新开始', '重新開始'],
  'process.shell': ['Windows 壳进程', 'Windows 殼處理程序'],
  'process.lsa': ['本地安全权限服务', '本機安全性授權服務'],
  'process.multimedia': ['多媒体支持进程', '多媒體支援處理程序'],
  'taskmgr.performance': ['性能', '效能'],
  'taskmgr.performance.title': ['性能监视器', '效能監視器'],
  'taskmgr.performance.disk': ['磁盘', '磁碟'],
  'taskmgr.performance.memory': ['内存', '記憶體'],
  'taskmgr.performance.wifi': ['网络', '網路'],
  'taskmgr.performance.wifi-speed': ['Mbps', 'Mbps'],
  'taskmgr.processes': ['进程', '處理程序'],
  'taskmgr.processes.title': ['正在运行的进程', '正在執行的處理程序'],
  'taskmgr.processes.name': ['名称', '名稱'],
  'taskmgr.processes.cpu': ['CPU', 'CPU'],
  'taskmgr.processes.memory': ['内存', '記憶體'],
  'taskmgr.processes.disk': ['磁盘', '磁碟'],
  'taskmgr.processes.power': ['电源', '電源'],
  'taskmgr.processes.no-results': ['未找到进程', '找不到處理程序'],
  'taskmgr.processes.reset-filter': ['重置筛选', '重設篩選'],
  'taskmgr.settings': ['设置', '設定'],
  'taskmgr.settings.title': ['任务管理器设置', '工作管理員設定'],
  'taskmgr.settings.stay-on-top': ['保持在最前面', '保持在最上層'],
  'taskmgr.settings.window-management': ['窗口管理', '視窗管理'],
  'taskmgr.settings.feedback': ['发送反馈', '傳送意見反應'],
  'taskmgr.settings.send-feedback': ['发送反馈', '傳送意見反應'],
  'cover-hp-close': ['关闭', '關閉']
};

function addKeys(file, idx) {
  const path = join(LANG, file);
  if (!existsSync(path)) { console.warn('missing', file); return 0; }
  let txt = readFileSync(path, 'utf8');
  const existing = new Set([...txt.matchAll(/^([^#=\s][^=]*)=/gm)].map(m => m[1].trim()));
  const add = [];
  for (const [k, v] of Object.entries(ZH)) { const val = v[idx]; if (!existing.has(k) && val) add.push(`${k}=${val}`); }
  if (add.length) {
    txt = txt.replace(/\s*$/, '\n') + `\n# ---- upstream gap fill (parity) ----\n` + add.join('\n') + '\n';
    writeFileSync(path, txt, 'utf8');
  }
  return add.length;
}
console.log('zh_CN added:', addKeys('lang_zh_CN.properties', 0));
console.log('zh_TW added:', addKeys('lang_zh_TW.properties', 1));
