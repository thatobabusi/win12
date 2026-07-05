/* global $, m_tab, server, pages, wifiStatus, isDark, apps */
// Win12 app — Microsoft Edge (tabbed browser).
//
// Extracted from apps.js onto the kernel. Depends on the shared globals m_tab
// (tab manager, tab.js), server/pages/isDark (desktop.js) and wifiStatus, all
// resolved via the shared global scope at call time. The two maxwin ops go
// through win12.windows.maximize. Registered via win12.apps. Loaded AFTER apps.js.
(function (global) {
  var edge = {
        init: () => {
            $('#win-edge>iframe').remove();
            apps.edge.tabs = [];
            apps.edge.len = 0;
            apps.edge.newtab();
        },
        tabs: [],
        now: null,
        len: 0,
        history: [],
        historypt: [],
        reloadElt: '<loading class="reloading"><svg viewBox="0 0 16 16"><circle cx="8px" cy="8px" r="5px"></circle><circle cx="8px" cy="8px" r="5px"></circle></svg></loading>',
        max: false,
        fuls: false,
        b1: false, b2: false, b3: false,
        newtab: () => {
            m_tab.newtab('edge', 'New Tab');
            apps.edge.initHistory(apps.edge.tabs[apps.edge.tabs.length - 1][0]);
            apps.edge.pushHistory(apps.edge.tabs[apps.edge.tabs.length - 1][0], 'mainpage.html');
            $('#win-edge').append(`<iframe src="mainpage.html" frameborder="0" class="${apps.edge.tabs[apps.edge.tabs.length - 1][0]}">`);
            $('#win-edge>.tool>input.url').focus();
            $('#win-edge>iframe')[apps.edge.tabs.length - 1].onload = function () {
                this.contentDocument.querySelector('input').onkeyup = function (e) {
                    if (e.keyCode == 13 && $(this).val() != '') {
                        apps.edge.goto($(this).val());
                    }
                };
                this.contentDocument.querySelector('svg').onclick = () => {
                    if ($(this.contentDocument.querySelector('input')).val() != '') {
                        apps.edge.goto($(this.contentDocument.querySelector('input')).val());
                    }
                };
            };
            m_tab.tab('edge', apps.edge.tabs.length - 1);
            apps.edge.checkHistory(apps.edge.tabs[apps.edge.now][0]);
        },
        fullscreen: () => {
            if (!apps.edge.max) {
                global.win12.windows.maximize('edge');
                apps.edge.max = !apps.edge.max;
            }
            document.getElementById('fuls-edge').style.display = 'none';
            document.getElementById('edge-max').style.display = 'none';
            document.getElementById('fuls-edge-exit').style.display = '';
            document.getElementById('over-bar').style.display = '';
            $('.edge>.titbar').hide();
            $('.edge>.content>.tool').hide();
            apps.edge.fuls = !apps.edge.fuls;
        },
        exitfullscreen: () => {
            if (apps.edge.max) {
                global.win12.windows.maximize('edge'); apps.edge.max = !apps.edge.max;
            }
            document.getElementById('fuls-edge').style.display = '';
            document.getElementById('edge-max').style.display = '';
            document.getElementById('fuls-edge-exit').style.display = 'none';
            document.getElementById('over-bar').style.display = 'none';
            $('.edge>.titbar').show();
            $('.edge>.content>.tool').show();
            apps.edge.fuls = !apps.edge.fuls;
        },
        in_div(id, event) {
            var div = document.getElementById(id);
            var x = event.clientX;
            var y = event.clientY;
            var divx1 = div.offsetLeft;
            var divy1 = div.offsetTop;
            var divx2 = div.offsetLeft + div.offsetWidth;
            var divy2 = div.offsetTop + div.offsetHeight;
            if (x < divx1 || x > divx2 || y < divy1 || y > divy2) {
                //如果离开，则执行。。 
                return false;
            }
            else {
                //如检播到，则执行。。 
                return true;
            }
        },
        settab: (t, i) => {
            if ($('.window.edge>.titbar>.tabs>.tab.' + t[0] + '>.reloading')[0]) {
                return `<div class="tab ${t[0]}" onclick="m_tab.tab('edge',${i})" oncontextmenu="showcm(event,'edge.tab',${i});stop(event);return false" onmousedown="m_tab.moving('edge',this,event,${i});stop(event);disableIframes();" ontouchstart="m_tab.moving('edge',this,event,${i});stop(event);disableIframes();">${apps.edge.reloadElt}<p>${t[1]}</p><span class="clbtn bi bi-x" onclick="m_tab.close('edge',${i})"></span></div>`;
            }
            else {
                return `<div class="tab ${t[0]}" onclick="m_tab.tab('edge',${i})" oncontextmenu="showcm(event,'edge.tab',${i});stop(event);return false" onmousedown="m_tab.moving('edge',this,event,${i});stop(event);disableIframes();" ontouchstart="m_tab.moving('edge',this,event,${i});stop(event);disableIframes();"><p>${t[1]}</p><span class="clbtn bi bi-x" onclick="m_tab.close('edge',${i})"></span></div>`;
            }
        },
        tab: (c) => {
            $('#win-edge>iframe.show').removeClass('show');
            $('#win-edge>iframe.' + apps.edge.tabs[c][0]).addClass('show');
            $('#win-edge>.tool>input.url').val($('#win-edge>iframe.' + apps.edge.tabs[c][0]).attr('src') == 'mainpage.html' ? '' : $('#win-edge>iframe.' + apps.edge.tabs[c][0]).attr('src'));
            $('#win-edge>.tool>input.rename').removeClass('show');
            apps.edge.checkHistory(apps.edge.tabs[apps.edge.now][0]);
        },
        c_rename: (c) => {
            m_tab.tab('edge', c);
            $('#win-edge>.tool>input.rename').val(apps.edge.tabs[apps.edge.now][1]);
            $('#win-edge>.tool>input.rename').addClass('show');
            setTimeout(() => {
                $('#win-edge>.tool>input.rename').focus();
            }, 300);
        },
        reload: () => {
            if (wifiStatus == false) {
                $('#win-edge>iframe.show').attr('src', 'data/disconnected' + (isDark ? '_dark' : '') + '.html');
            }
            else {
                $('#win-edge>iframe.show').attr('src', $('#win-edge>iframe.show').attr('src'));
                if (!$('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0] + '>.reloading')[0]) {
                    $('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0])[0].insertAdjacentHTML('afterbegin', apps.edge.reloadElt);
                    $('#win-edge>iframe.' + apps.edge.tabs[apps.edge.now][0])[0].onload = function () {
                        $('.window.edge>.titbar>.tabs>.tab.' + this.classList[0])[0].removeChild($('.window.edge>.titbar>.tabs>.tab.' + this.classList[0] + '>.reloading')[0]);
                    };
                }
            }
        },
        getTitle: async (url, np) => {
            const response = await fetch(server + pages['get-title'] + `?url=${url}`);
            if (response.ok == true) {
                const text = await response.text();
                apps.edge.tabs[np][1] = text;
                m_tab.settabs('edge');
                m_tab.tab('edge', np);
            }
        },
        goto: (u, clear = true) => {
            if (wifiStatus == false) {
                m_tab.rename('edge', u);
                $('#win-edge>iframe.show').attr('src', '.data/disconnected' + (isDark ? '_dark' : '') + '.html');
                $('#win-edge>.tool>input.url').val(u);
            }
            else {
                // 6
                if (!/^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/.test(u) && !u.match(/^mainpage.html$/)) {
                    // 启用必应搜索
                    $('#win-edge>iframe.show').attr('src', 'https://bing.com/search?q=' + encodeURIComponent(u));
                    m_tab.rename('edge', u);
                }
                // 检测网址是否带有 http 头
                else if (!/^https?:\/\//.test(u) && !u.match(/^mainpage.html$/)) {
                    $('#win-edge>iframe.show').attr('src', 'http://' + u);
                    m_tab.rename('edge', 'http://' + u);
                }
                else {
                    $('#win-edge>iframe.show').attr('src', u);
                    m_tab.rename('edge', u.match(/^mainpage.html$/) ? 'New Tab' : u);
                }
                if (!$('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0] + '>.reloading')[0]) {
                    $('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0])[0].insertAdjacentHTML('afterbegin', apps.edge.reloadElt);
                }
                $('#win-edge>iframe.' + apps.edge.tabs[apps.edge.now][0])[0].onload = function () {
                    $('.window.edge>.titbar>.tabs>.tab.' + this.classList[0])[0].removeChild($('.window.edge>.titbar>.tabs>.tab.' + this.classList[0] + '>.reloading')[0]);
                };
                apps.edge.getTitle($('#win-edge>iframe.show').attr('src'), apps.edge.now);
                if (clear) {
                    apps.edge.delHistory(apps.edge.tabs[apps.edge.now][0]);
                    apps.edge.pushHistory(apps.edge.tabs[apps.edge.now][0], $('#win-edge>iframe.show').attr('src'));
                }
                apps.edge.checkHistory(apps.edge.tabs[apps.edge.now][0]);
            }

        },
        initHistory: (tab) => {
            apps.edge.history[tab] = [];
            apps.edge.historypt[tab] = -1;
        },
        pushHistory: (tab, u) => {
            apps.edge.history[tab].push(u);
            apps.edge.historypt[tab]++;
        },
        topHistory: (tab) => {
            return apps.edge.history[tab][apps.edge.historypt[tab]];
        },
        popHistory: (tab) => {
            apps.edge.historypt[tab]--;
            return apps.edge.history[tab][apps.edge.historypt[tab]];
        },
        incHistory: (tab) => {
            apps.edge.historypt[tab]++;
            return apps.edge.history[tab][apps.edge.historypt[tab]];
        },
        delHistory: (tab) => {
            apps.edge.history[tab].splice(apps.edge.historypt[tab] + 1, apps.edge.history[tab].length - 1 - apps.edge.historypt[tab]);
        },
        historyIsEmpty: (tab) => {
            return apps.edge.historypt[tab] <= 0;
        },
        historyIsFull: (tab) => {
            return apps.edge.historypt[tab] >= apps.edge.history[tab].length - 1;
        },
        checkHistory: (tab) => {
            if (apps.edge.historyIsEmpty(tab)) {
                $('#win-edge>.tool>.back').addClass('disabled');
            }
            else if (!apps.edge.historyIsEmpty(tab)) {
                $('#win-edge>.tool>.back').removeClass('disabled');
            }
            if (apps.edge.historyIsFull(tab)) {
                $('#win-edge>.tool>.front').addClass('disabled');
            }
            else if (!apps.edge.historyIsFull(tab)) {
                $('#win-edge>.tool>.front').removeClass('disabled');
            }
        },
        back: (tab) => {
            apps.edge.goto(apps.edge.popHistory(tab), false);
            apps.edge.checkHistory(tab);
        },
        front: (tab) => {
            apps.edge.goto(apps.edge.incHistory(tab), false);
            apps.edge.checkHistory(tab);
        }
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('edge', edge);
  } else {
    (global.apps = global.apps || {}).edge = edge;
  }
})(typeof window !== 'undefined' ? window : globalThis);
