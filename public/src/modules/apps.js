// 应用功能
window.apps = {
    // setting extracted to public/src/apps/setting.js (registers via win12.apps)
    msstore: {
        init: () => {
            $('#win-msstore>.menu>list>a.home')[0].click();
        },
        page: (name) => {
            $('#win-msstore>.page>.cnt.' + name).scrollTop(0);
            $('#win-msstore>.page>.cnt.show').removeClass('show');
            $('#win-msstore>.page>.cnt.' + name).addClass('show');
            $('#win-msstore>.menu>list>a.check').removeClass('check');
            $('#win-msstore>.menu>list>a.' + name).addClass('check');
        }
    },
    // run extracted to public/src/apps/run.js (registers via win12.apps)
    // taskmgr extracted to public/src/apps/taskmgr.js (registers via win12.apps)
    // whiteboard extracted to public/src/apps/whiteboard.js (registers via win12.apps)
    // webapp 即将网页嵌套作为应用内容，格式参考 desktop.html 中 vscode, bilibili
    webapps: {
        apps: ['vscode', 'bilibili', 'copilot', 'minesweeper'],
        init: () => {
            for (const app of apps.webapps.apps) {
                apps[app].load();
            }
        }
    },
    vscode: {
        init: () => {
            return null;
        },
        load: () => {
            // 不能改成 vscode.dev, 别问，问就算用不了
            $('#win-vscode')[0].insertAdjacentHTML('afterbegin', '<iframe src="https://github1s.com/" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe>');
        }
    },
    bilibili: {
        init: () => {
            return null;
        },
        load: () => {
            $('#win-bilibili')[0].insertAdjacentHTML('afterbegin', '<iframe src="https://bilibili.com/" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe>');
        }
    },
    'copilot': {
        init: () => {
            return null;
        },
        load: () => {
            // The AI Copilot backend (/chatgh/) was part of the upstream service
            // that is no longer hosted, so there is no copilot.html to embed.
            // Embedding it 404s and — via the host's SPA fallback to index.html —
            // used to spin an infinite boot-redirect loop inside this iframe.
            // Show a message instead of loading a dead URL.
            $('#win-copilot')[0].insertAdjacentHTML('afterbegin',
                '<div style="display:flex;align-items:center;justify-content:center;height:100%;padding:24px;text-align:center;opacity:0.7;">'
                + 'AI Copilot is unavailable in this build (it required an upstream service that is no longer hosted).</div>');
        }
    },
    'minesweeper': {
        init: () => {
            return null;
        },
        load: () => {
            // Use the bundled local game, not the dead upstream host. The file
            // ships at public/src/games/minesweeper.html (path is relative to the
            // desktop.html document root).
            $('#win-minesweeper')[0].insertAdjacentHTML('afterbegin', '<iframe src="src/games/minesweeper.html" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe>');
        }
    },
    defender: {
        init: () => {
            return null;
        },
        load: () => {
            var chart = $('#chart')[0].getContext('2d'),
                gradient = chart.createLinearGradient(0, 0, 0, 450);
            gradient.addColorStop(0, 'rgba(0, 199, 214, 0.32)');
            gradient.addColorStop(0.3, 'rgba(0, 199, 214, 0.1)');
            gradient.addColorStop(1, 'rgba(0, 199, 214, 0)');
            var data = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [{
                    label: lang('Number of virus attacks', 'taskmgr.virus-attacks'),
                    backgroundColor: gradient,
                    pointBackgroundColor: '#00c7d6',
                    borderWidth: 1,
                    borderColor: '#0e1a2f',
                    data: [60, 45, 80, 30, 35, 55, 25, 80, 40, 50, 80, 50]
                }]
            };
            var options = {
                responsive: true,
                maintainAspectRatio: true,
                animation: {
                    easing: 'easeInOutQuad',
                    duration: 520
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: '#5e6a81'
                        },
                        gridLines: {
                            color: 'rgba(200, 200, 200, 0.08)',
                            lineWidth: 1
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: '#5e6a81'
                        }
                    }]
                },
                elements: {
                    line: {
                        tension: 0.4
                    }
                },
                legend: {
                    display: false
                },
                point: {
                    backgroundColor: '#00c7d6'
                },
                tooltips: {
                    titleFontFamily: 'Poppins',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    titleFontColor: 'white',
                    caretSize: 5,
                    cornerRadius: 2,
                    xPadding: 10,
                    yPadding: 10
                }
            };
            var chartInstance = new Chart(chart, {
                type: 'line',
                data: data,
                options: options
            });
        }
    },
    camera: {
        init: () => {
            if (!localStorage.getItem('camera')) {
                showwin('camera-notice');
                return null;
            }
            if (localStorage.getItem('camera')) {
                apps.camera.streaming = false;
                apps.camera.video = $('#win-camera video')[0];
                apps.camera.canvas = $('#win-camera canvas')[0];
                apps.camera.context = apps.camera.canvas.getContext('2d');
                apps.camera.context.fillStyle = '#aaa';
                apps.camera.downloadLink = $('#win-camera a')[0];
                // apps.camera.control = document.querySelector('#win-camera>.control')
                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then(stream => {
                        apps.camera.video.srcObject = stream;
                        apps.camera.video.play();
                    })
                    .catch(() => {
                        hidewin('camera');
                    });
                apps.camera.video.addEventListener('canplay', () => {
                    if (!apps.camera.streaming) {
                        apps.camera.aspectRatio = apps.camera.video.videoWidth / apps.camera.video.videoHeight;
                        apps.camera.canvas.width = apps.camera.video.videoWidth;
                        apps.camera.canvas.height = apps.camera.video.videoHeight;
                        apps.camera.windowResizeObserver = new ResizeObserver(apps.camera.resize);
                        apps.camera.windowResizeObserver.observe($('.window.camera')[0], { box: 'border-box' });
                        apps.camera.streaming = true;
                    }
                });
            }
            else {
                hidewin('camera');
            }
        },
        clearCanvas: () => {
            apps.camera.context.fillRect(0, 0, canvas.width, canvas.height);
        },
        takePhoto: () => {
            apps.camera.context.drawImage(apps.camera.video, 0, 0, apps.camera.canvas.width, apps.camera.canvas.height);
            apps.camera.downloadLink.href = apps.camera.canvas.toDataURL('image/png');
            apps.camera.downloadLink.download = 'photo.png';
            apps.camera.downloadLink.click();
        },
        notice: () => {
            if (!localStorage.getItem('camera')) {
                showwin('camera-notice');
            }
            else {
                openapp('camera');
            }
        },
        resize: () => {
            let w = $('#win-camera')[0].offsetWidth,
                h = $('#win-camera')[0].offsetHeight;
            if (w / apps.camera.aspectRatio <= h) {
                if (!$('#win-camera').hasClass('v')) {
                    $('#win-camera').removeClass('h');
                    $('#win-camera').addClass('v');
                }
            }
            else if (w / apps.camera.aspectRatio >= h) {
                if (!$('#win-camera').hasClass('h')) {
                    $('#win-camera').removeClass('v');
                    $('#win-camera').addClass('h');
                }
            }
        },
        remove: () => {
            apps.camera.video.srcObject.getTracks().forEach((t) => {
                t.stop();
            });
            apps.camera.video.srcObject = null;
        }
    },
    // explorer extracted to public/src/apps/explorer.js (registers via win12.apps)
    // calc extracted to public/src/apps/calc.js (registers via win12.apps)
    // about extracted to public/src/apps/about.js (registers via win12.apps)
    // notepad extracted to public/src/apps/notepad.js (registers via win12.apps)
    // imgviewer extracted to public/src/apps/imgviewer.js (registers via win12.apps)
    // mediaplayer extracted to public/src/apps/mediaplayer.js (registers via win12.apps)
    // pdfviewer extracted to public/src/apps/pdfviewer.js (registers via win12.apps)
    // codeEditor extracted to public/src/apps/codeEditor.js (registers via win12.apps)
    pythonEditor: {
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
    },
    notepadFonts: {
        sizes: {
            '初号': '56',
            '小初': '48',
            '一号': '34.7',
            '小一': '32',
            '二号': '29.3',
            '小二': '24',
            '三号': '21.3',
            '小三': '20',
            '四号': '18.7',
            '小四': '16',
            '五号': '14',
            '小五': '12'
        },
        styles: {
            '正常': '',
            '粗体': 'font-weight: bold;',
            '斜体': 'font-style: italic;',
            '粗偏斜体': 'font-weight: bold; font-style: italic;'
        },
        load: () => {
            apps.notepadFonts.fontvalues = $('#win-notepad-font>.row>#win-notepad-font-type>.value-box>.option');
            apps.notepadFonts.sizevalues = $('#win-notepad-font>.row>#win-notepad-font-size>.value-box>.option');
            apps.notepadFonts.stylevalues = $('#win-notepad-font>.row>#win-notepad-font-style>.value-box>.option');
            apps.notepadFonts.typeinput = $('#win-notepad-font>.row>#win-notepad-font-type>input[type=text]')[0];
            apps.notepadFonts.sizeinput = $('#win-notepad-font>.row>#win-notepad-font-size>input[type=text]')[0];
            apps.notepadFonts.styleinput = $('#win-notepad-font>.row>#win-notepad-font-style>input[type=text]')[0];
            apps.notepadFonts.previewBox = $('#win-notepad-font>.preview>.preview-box');
            apps.notepadFonts.textBox = $('.notepad>#win-notepad>.text-box');

            for (const elt of apps.notepadFonts.fontvalues) {
                elt.onclick = function () {
                    apps.notepadFonts.typeinput.value = this.innerText;
                    apps.notepadFonts.preview();
                };
                elt.setAttribute('style', `font-family: ${elt.innerText};`);
            }

            for (const elt of apps.notepadFonts.sizevalues) {
                elt.onclick = function () {
                    apps.notepadFonts.sizeinput.value = this.innerText;
                    apps.notepadFonts.preview();
                };
            }

            for (const elt of apps.notepadFonts.stylevalues) {
                elt.onclick = function () {
                    apps.notepadFonts.styleinput.value = this.innerText;
                    apps.notepadFonts.preview();
                };
                elt.setAttribute('style', apps.notepadFonts.styles[elt.innerText]);
            }

            apps.notepadFonts.sizeinput.addEventListener('keyup', apps.notepadFonts.preview);
            apps.notepadFonts.typeinput.addEventListener('keyup', apps.notepadFonts.preview);
        },
        preview: () => {
            var fontsize = 0;
            var fontstyle;
            if (!apps.notepadFonts.sizeinput.value.match(/^[0-9]*$/)) {
                if (apps.notepadFonts.sizes[apps.notepadFonts.sizeinput.value] != undefined) {
                    fontsize = apps.notepadFonts.sizes[apps.notepadFonts.sizeinput.value];
                }
            }
            else if (apps.notepadFonts.sizeinput.value.match(/^[0-9]*$/)) {
                fontsize = apps.notepadFonts.sizeinput.value;
            }
            if (apps.notepadFonts.styles[apps.notepadFonts.styleinput.value] != undefined) {
                fontstyle = apps.notepadFonts.styles[apps.notepadFonts.styleinput.value];
            }
            else if (apps.notepadFonts.styles[apps.notepadFonts.styleinput.value] == undefined) {
                fontstyle = apps.notepadFonts.styles['正常'];
            }
            apps.notepadFonts.previewBox.attr('style', `font-family: ${apps.notepadFonts.typeinput.value} !important; font-size: ${fontsize}px !important;${fontstyle}`);
        },
        commitFont: () => {
            const styles = window.getComputedStyle(apps.notepadFonts.previewBox[0], null);
            apps.notepadFonts.textBox.attr('style', `font-family: ${styles.fontFamily} !important; font-size: ${styles.fontSize} !important; font-weight: ${styles.fontWeight} !important; font-style: ${styles.fontStyle} !important;`);
            hidewin('notepad-fonts', 'configs');
        },
        reset: () => {
            const styles = window.getComputedStyle(apps.notepadFonts.textBox[0], null);
            apps.notepadFonts.typeinput.value = styles.fontFamily.split(', ')[0];
            var fontsize = styles.fontSize.split('px')[0];
            var fontweight = styles.fontWeight;
            var fontstyle = styles.fontStyle;
            if (fontweight == '700' && fontstyle == 'normal') {
                apps.notepadFonts.styleinput.value = '粗体';
            }
            else if (fontweight == '400' && fontstyle == 'italic') {
                apps.notepadFonts.styleinput = '斜体';
            }
            else if (fontweight == '700' && fontstyle == 'italic') {
                apps.notepadFonts.styleinput.value = '粗偏斜体';
            }
            else if (fontweight == '400' && fontstyle == 'normal') {
                apps.notepadFonts.styleinput.value = '正常';
            }
            for (const [key, value] of Object.entries(apps.notepadFonts.sizes)) {
                if (value == fontsize) {
                    fontsize = key;
                    break;
                }
            }
            apps.notepadFonts.sizeinput.value = fontsize;
        },
    },
    python: {
        codeCache: '',
        prompt: '>>> ',
        indent: false,
        load: () => {
            (async function () {
                apps.python.pyodide = await loadPyodide();
                apps.python.pyodide.runPython(`
import sys
import io
`);
            })();
        },
        init: () => {
            $('#win-python').html(`
        <pre>
Python 3.11.2  [MSC v.1912 64 bit (AMD64)] :: Anaconda, Inc. on win32
Type "help", "copyright", "credits" or "license" for more information.
        </pre>
        <pre class="text-cmd"></pre>
        <pre style="display: flex;"><span class='prompt'>>>> </span><input type="text" onkeyup="if (event.keyCode == 13) { apps.python.run(); }"></pre>`);
        },
        run: () => {
            if (apps.python.pyodide) {
                const input = $('#win-python>pre>input');
                const _code = input.val();
                if (_code == 'exit()') {
                    hidewin('python');
                    input.val('');
                }
                else {
                    const elt = $('#win-python>pre.text-cmd')[0];
                    const lastChar = _code[_code.length - 1];
                    var newD = document.createElement('div');
                    newD.innerText = `${apps.python.prompt}${_code}`;
                    elt.appendChild(newD);
                    if (lastChar != ':' && lastChar != '\\' && ((!apps.python.indent || _code == ''))) {
                        apps.python.prompt = '>>> ';
                        apps.python.codeCache += _code;
                        apps.python.indent = false;
                        const code = apps.python.codeCache;
                        apps.python.codeCache = '';
                        apps.python.pyodide.runPython('sys.stdout = io.StringIO()');
                        try {
                            const result = String(apps.python.pyodide.runPython(code));
                            if (apps.python.pyodide.runPython('sys.stdout.getvalue()')) {
                                var newD = document.createElement('div');
                                newD.innerText = `${apps.python.pyodide.runPython('sys.stdout.getvalue()')}`;
                                elt.appendChild(newD);
                            }
                            if (result && result != 'undefined') {
                                var newD = document.createElement('div');
                                if (result == 'false') {
                                    newD.innerText = 'False';
                                }
                                else if (result == 'true') {
                                    newD.innerText = 'True';
                                }
                                else {
                                    newD.innerText = result;
                                }
                                elt.appendChild(newD);
                            }
                        }
                        catch (err) {
                            var newD = document.createElement('div');
                            newD.innerText = `${err.message}`;
                            elt.appendChild(newD);
                        }
                    }
                    else {
                        apps.python.prompt = '... ';
                        if (lastChar == ':') {
                            apps.python.indent = true;
                        }
                        apps.python.codeCache += _code + '\n';
                    }
                    input.val('');

                    // 自动聚焦
                    input.blur();
                    input.focus();

                    $('#win-python .prompt')[0].innerText = apps.python.prompt;
                }
            }
        }
    },
    // terminal extracted to public/src/apps/terminal.js (registers via win12.apps)
    search: {
        rand: [{ name: 'Bottle Cap Introduction.txt', bi: 'text', ty: 'Text Document' },
        { name: 'Bottle Cap Diagram.png', bi: 'image', ty: 'PNG File' },
        { name: 'Bottle Cap Structure.docx', bi: 'richtext', ty: 'Microsoft Word 文档' },
        { name: 'Coca Cola Bottle Cap.jpg', bi: 'image', ty: 'JPG File' },
        { name: 'Coca Cola Cap History.pptx', bi: 'slides', ty: 'Microsoft PowerPoint Presentation' },
        { name: 'Bottle Cap Quality Analysis.xlsx', bi: 'ruled', ty: 'Microsoft Excel Worksheet' },
        { name: 'Bottle Cap.svg', bi: 'image', ty: 'SVG File' },
        { name: 'Bottle Cap Intro.doc', bi: 'richtext', ty: 'Microsoft Word 文档' }],
        search: le => {
            if (le > 0) {
                $('#search-win>.ans>.list>list').html(
                    `<a class="a" onclick="apps.search.showdetail(${le % 8})"><i class="bi bi-file-earmark-${apps.search.rand[le % 8].bi}"></i> ${apps.search.rand[le % 8].name
                    }</a><a class="a" onclick="apps.search.showdetail(${(le + 3) % 8})"><i class="bi bi-file-earmark-${apps.search.rand[(le + 3) % 8].bi}"></i> ${apps.search.rand[(le + 3) % 8].name}</a>`);
                apps.search.showdetail(le % 8);
            } else {
                $('#search-win>.ans>.list>list').html(
                    `<p class="text">Recommended</p>
					<a onclick="openapp('setting');$('#search-btn').removeClass('show');
					$('#search-win').removeClass('show');
					setTimeout(() => {
						$('#search-win').removeClass('show-begin');
					}, 200);">
						<img src="assets/icons/setting.svg"><p>设置</p></a>
					<a onclick="openapp('about');$('#search-btn').removeClass('show');
					$('#search-win').removeClass('show');
					setTimeout(() => {
						$('#search-win').removeClass('show-begin');
					}, 200);">
						<img src="assets/icons/about.svg"><p>${getAboutAppTitle()}</p></a>`);
                $('#search-win>.ans>.view').removeClass('show');
            }
        },
        showdetail: i => {
            $('#search-win>.ans>.view').addClass('show');
            let inf = apps.search.rand[i];
            $('#search-win>.ans>.view>.fname>.bi').attr('class', 'bi bi-file-earmark-' + inf.bi);
            $('#search-win>.ans>.view>.fname>.name').text(inf.name);
            $('#search-win>.ans>.view>.fname>.type').text(inf.ty);
        }
    },
    // edge extracted to public/src/apps/edge.js (registers via win12.apps)
    winver: {
        init: () => {
            $('#win-winver>.mesg').show();
        },
    },
    windows12: {
        init: () => {
            document.getElementById('win12-window').src = './boot.html';
        }
    },
    wsa: {
        init: () => {
            null;
        }
    },
    word: {
        init: () => {
            $('#win-word>.app-left>.focs>.home').css("display", "flex");
            $('#win-word>.app-left>.focs>.back').css("display", "none");
            $('.window.word>.pages>.edit').removeClass('show');
            $('.window.word>.pages>.home').addClass('show');
            $(`.window.word>.pages>.edit>.content`).empty();
            $(`.window.word>.pages>.edit>.content`).append(`<div class="doc homepage" contenteditable></div>`);
        },
        edit: () => {
            $('.window.word>.pages>.home').removeClass('show');
            $('.window.word>.pages>.edit').addClass('show');
        },
        home: () => {
            $('#win-word>.app-left>.focs>.home').css("display", "none");
            $('#win-word>.app-left>.focs>.back').css("display", "flex");
            $('.window.word>.pages>.edit').removeClass('show');
            $('.window.word>.pages>.home').addClass('show');
        },
        new: () => {
            $(`.window.word>.pages>.edit>.content`).empty();
            $(`.window.word>.pages>.edit>.content`).append(`<div class="doc homepage" contenteditable></div>`);
            $('.window.word>.pages>.home').removeClass('show');
            $('.window.word>.pages>.edit').addClass('show');
        },
    }
};
