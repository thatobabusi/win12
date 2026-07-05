/* global $, run_cmd, runcmd, nts, shownotice, apps */
// Win12 app — Run dialog.
//
// Extracted from apps.js onto the kernel. Depends on globals defined in
// desktop.js (run_cmd, runcmd(), nts, shownotice()) and on apps.explorer /
// apps.edge — all resolved via the shared global scope at call time. Loaded
// AFTER apps.js so the registration is not clobbered.
(function (global) {
  // The two original error branches built an identical notice; dedup'd here.
  const cannotOpen = (cmd) => ({
    cnt: '<p class="tit">' + cmd + '</p><p>Windows cannot find the file \'' + cmd + '\'. Please verify the filename is correct and try again.</p> ',
    btn: [
      { type: 'main', text: 'OK', js: 'closenotice();showwin(\'run\');$(\'#win-run>.open>input\').select();' },
      { type: 'cancel', text: 'Search in Microsoft Edge', js: 'closenotice();openapp(\'edge\');window.setTimeout(() => {apps.edge.newtab();apps.edge.goto(\'https://www.bing.com/search?q=' + encodeURIComponent(cmd) + '\');}, 300);' }
    ]
  });

  var run = {
    init: () => {
      $('#win-run>.open>input').val(run_cmd); // Windows keeps the last run input
      window.setTimeout(() => {
        $('#win-run>.open>input').focus();
        $('#win-run>.open>input').select();
      }, 300);
    },
    run: (cmd) => {
      if (runcmd(cmd)) return;
      if (cmd === '') return;
      try {
        cmd = cmd.replace(/\/$/, '');
        const pathl = cmd.split('/');
        let tmp = apps.explorer.getPath();
        let valid = true;
        pathl.forEach((name) => {
          if (Object.prototype.hasOwnProperty.call(tmp['folder'], name)) {
            tmp = tmp['folder'][name];
          } else {
            valid = false;
            return false;
          }
        });
        if (valid) {
          run_cmd = cmd;
          global.win12.windows.open('explorer');
          window.setTimeout(() => { apps.explorer.goto(cmd); }, 300);
        } else {
          nts['Can-not-open-file'] = cannotOpen(cmd);
          shownotice('Can-not-open-file');
        }
      } catch {
        nts['Can-not-open-file'] = cannotOpen(cmd);
        shownotice('Can-not-open-file');
      }
    }
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('run', run);
  } else {
    (global.apps = global.apps || {}).run = run;
  }
})(typeof window !== 'undefined' ? window : globalThis);
