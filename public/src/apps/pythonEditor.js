// Win12 app — pythonEditor. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  var pythonEditor = {
        editor: null,
        init: () => {
            return null;
        },
        run: () => {
            let result;
            let output = document.getElementById('output');
            try {
                if (apps.python.pyodide) {
                    let code = apps.pythonEditor.editor.getValue();
                    apps.python.pyodide.runPython('sys.stdout = io.StringIO()');
                    apps.python.pyodide.runPython(code);
                    result = apps.python.pyodide.runPython('sys.stdout.getvalue()');
                }
            }
            catch (e) {
                result = e.message;
            }
            output.innerHTML = result;
        },
        load: () => {
            if (!apps.python.loaded) {
                apps.python.loaded = true;
                apps.python.load();
            }
            ace.require('ace/ext/language_tools');
            apps.pythonEditor.editor = ace.edit('win-python-ace-editor');
            apps.pythonEditor.editor.session.setMode('ace/mode/python');
            apps.pythonEditor.editor.setTheme('ace/theme/vibrant_ink');
            apps.pythonEditor.editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                showPrintMargin: false,
                enableLiveAutocompletion: true
            });
        }
    };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('pythonEditor', pythonEditor);
  } else {
    (global.apps = global.apps || {}).pythonEditor = pythonEditor;
  }
})(typeof window !== 'undefined' ? window : globalThis);
