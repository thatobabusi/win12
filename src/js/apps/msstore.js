// Win12 app — msstore. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  // Curated catalog of real, launchable apps already built into this OS.
  // "Installing" pins the app to the Start Menu (persisted, reuses pinapp())
  // so the Store is an honest feature — it never offers apps that don't exist.
  const catalog = [
    { id: 'calc', name: 'Calculator', nameKey: 'calc.name', category: 'msstore.tool' },
    { id: 'notepad', name: 'Notepad', nameKey: 'notepad.name', category: 'msstore.tool' },
    { id: 'terminal', name: 'Terminal', nameKey: 'terminal.name', category: 'msstore.devtool' },
    { id: 'explorer', name: 'File Explorer', nameKey: 'explorer.name', category: 'msstore.tool' },
    { id: 'whiteboard', name: 'Whiteboard', nameKey: 'whiteboard.title', category: 'msstore.design' },
    { id: 'mediaplayer', name: 'Media Player', nameKey: 'mediaplayer.name', category: 'msstore.design' },
    { id: 'pdfviewer', name: 'PDF Viewer', nameKey: 'pdfviewer.name', category: 'msstore.tool' },
    { id: 'imgviewer', name: 'Photos', nameKey: 'imgviewer.name', category: 'msstore.design' },
    { id: 'camera', name: 'Camera', nameKey: 'camera.name', category: 'msstore.design' },
    { id: 'word', name: 'Microsoft Word Preview', nameKey: 'word.name', category: 'msstore.business' },
    { id: 'vscode', name: 'Visual Studio Code', category: 'msstore.devtool' },
    { id: 'pythonEditor', name: 'Python Editor', category: 'msstore.devtool' },
    { id: 'edge', name: 'Microsoft Edge', nameKey: 'edge.name', category: 'msstore.tool' },
    { id: 'copilot', name: 'Copilot', category: 'msstore.tool' }
  ];
  const gameCatalog = [
    { id: 'minesweeper', name: 'Minesweeper', category: 'msstore.game' }
  ];
  const allEntries = catalog.concat(gameCatalog);

  function getInstalled() {
    const raw = localStorage.getItem('store_installed');
    if (raw === null) return [];
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function setInstalled(ids) {
    localStorage.setItem('store_installed', JSON.stringify(ids));
  }

  function isInstalled(id) {
    return getInstalled().includes(id);
  }

  function displayName(entry) {
    return entry.nameKey ? lang(entry.name, entry.nameKey) : entry.name;
  }

  function categoryLabel(entry) {
    return lang(entry.category.replace('msstore.', ''), entry.category);
  }

  function cardHtml(entry) {
    const installed = isInstalled(entry.id);
    const isGame = entry.category === 'msstore.game';
    const typeLabel = isGame ? lang('Game', 'msstore.game') : lang('Free', 'msstore.free');
    const btnLabel = installed ? lang('Open', 'open') : lang('Get', 'msstore.get');
    const btnAction = installed ? `openapp('${entry.id}')` : `apps.msstore.install('${entry.id}')`;
    return `<div class="${entry.id}" oncontextmenu="return showcm(event, 'store-card', ['${entry.id}', '${displayName(entry).replace(/'/g, '&apos;')}'])">
      <div class="left"><img src="assets/icons/${global.geticon(entry.id)}" style="width:70%;height:70%;object-fit:contain;"></div>
      <div class="right">
        <div class="tit">
          <div class="up">
            <div class="name">${displayName(entry)}</div>
            <div class="type">${typeLabel}</div>
          </div>
          <div class="down">
            <div class="rating"></div>
            <div class="cate">${categoryLabel(entry)}</div>
          </div>
        </div>
        <a class="a store-btn${installed ? ' installed' : ''}" onclick="${btnAction}">${btnLabel}</a>
      </div>
    </div>`;
  }

  function renderCatalog() {
    $('#win-msstore>.page>.cnt.apps').html(catalog.map(cardHtml).join(''));
    $('#win-msstore>.page>.cnt.game').html(gameCatalog.map(cardHtml).join(''));
  }

  var msstore = {
    init: () => {
      renderCatalog();
      $('#win-msstore>.menu>list>a.home')[0].click();
    },
    page: (name) => {
      $('#win-msstore>.page>.cnt.' + name).scrollTop(0);
      $('#win-msstore>.page>.cnt.show').removeClass('show');
      $('#win-msstore>.page>.cnt.' + name).addClass('show');
      $('#win-msstore>.menu>list>a.check').removeClass('check');
      $('#win-msstore>.menu>list>a.' + name).addClass('check');
    },
    isInstalled: isInstalled,
    install: (id) => {
      if (isInstalled(id)) return;
      const entry = allEntries.find(e => e.id === id);
      if (!entry) return;
      setInstalled(getInstalled().concat([id]));
      global.pinapp(id, displayName(entry), `openapp(&quot;${id}&quot;)`);
      renderCatalog();
    },
    uninstall: (id) => {
      setInstalled(getInstalled().filter(x => x !== id));
      $(`#startmenu-r>.pinned>.apps>.sm-app.${id}`).remove();
      renderCatalog();
    }
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('msstore', msstore);
  } else {
    (global.apps = global.apps || {}).msstore = msstore;
  }
})(typeof window !== 'undefined' ? window : globalThis);
