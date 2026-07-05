/* global $, runcmd */
// Win12 app — Terminal.
//
// Extracted from apps.js onto the kernel. Uses apps.terminal.* self-references
// (resolved via the registered window.apps.terminal) and the global runcmd()
// from desktop.js. The one window op (hidewin on "exit") goes through the
// win12.windows facade. Loaded AFTER apps.js.
(function (global) {
  var terminal = {
        historyList: [],
        historypt: 0,
        historyTemp: '',
        isViewingHistory: false,
        init: () => {
            $('#win-terminal').html(`<pre>
Micrȯsoft Windows [版本 12.0.39035.7324]
(c) Microṡoft Corporation。保留所有杈利。
        </pre>
        <pre class="text-cmd"></pre>
        <pre style="display: flex"><span class="prompt">C:\\Windows\\System32> </span><input type="text" onkeyup="apps.terminal.handleKeyUp(event)"></pre>`);
            $('#win-terminal>pre>input').focus();
        },
        handleKeyUp: (event) => {
            const input = $('#win-terminal input');
            if (event.keyCode === 13) { // Enter
                apps.terminal.run();
            } else if (event.keyCode === 38) { // Up arrow
                apps.terminal.history('up');
            } else if (event.keyCode === 40) { // Down arrow
                apps.terminal.history('down');
            }
        },
        run: () => {
            const elt = $('#win-terminal>pre.text-cmd')[0];
            const input = $('#win-terminal input');
            const command = input.val().trim();

            if (command !== '') {
                // Add command to history
                apps.terminal.historyList.push(command);
                apps.terminal.historypt = apps.terminal.historyList.length;

                var newD = document.createElement('div');
                newD.innerText = `C:\\Windows\\System32> ${command}`;
                elt.appendChild(newD);

                if (command === 'exit') {
                    global.win12.windows.hide('terminal');
                } else if (!runcmd(command, true)) {
                    var newD = document.createElement('div');
                    newD.innerText = `"${command}" 不是内部或外部命令，也不是可运行程序或批处理文件`;
                    elt.appendChild(newD);
                }
            }

            input.val('');
            input.blur();
            input.focus();
        },
        history: (direction) => {
            const input = $('#win-terminal input');

            if (!apps.terminal.isViewingHistory) {
                apps.terminal.isViewingHistory = true;
                apps.terminal.historyTemp = input.val();
            }

            if (direction === 'up' && apps.terminal.historypt > 0) {
                apps.terminal.historypt--;
                input.val(apps.terminal.historyList[apps.terminal.historypt]);
            } else if (direction === 'down') {
                apps.terminal.historypt++;
                if (apps.terminal.historypt >= apps.terminal.historyList.length) {
                    apps.terminal.historypt = apps.terminal.historyList.length;
                    apps.terminal.isViewingHistory = false;
                    input.val(apps.terminal.historyTemp);
                } else {
                    input.val(apps.terminal.historyList[apps.terminal.historypt]);
                }
            }
        }
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('terminal', terminal);
  } else {
    (global.apps = global.apps || {}).terminal = terminal;
  }
})(typeof window !== 'undefined' ? window : globalThis);
