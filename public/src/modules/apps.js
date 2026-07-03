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
    taskmgr: {
        sortType: 'cpu',
        sortOrder: 'up-down',
        tasks: structuredClone(taskmgrTasks),
        cpu: 0,
        cpuChart: null,
        cpuBg: null,
        memory: 0,
        memoryChart: null,
        memoryBg: null,
        memory2Elt: null,
        cpuRunningTime: 0,
        disk: 0,
        diskChart: null,
        diskBg: null,
        disk2Chart: null,
        disk2Bg: null,
        diskSpeed: {
            read: 0,
            write: 0
        },
        wifi: {
            receive: 0,
            send: 0
        },
        wifiChart: null,
        wifiBg: null,
        gpu: {
            d3: 0,
            copy: 0,
            videod: 0,
            videop: 0,
            usage: 0
        },
        gpuChart: [null, null, null, null],
        gpuBg: [null, null, null, null],
        gpu2Chart: [null, null],
        gpu2Bg: [null, null],
        gpuMemory: {
            private: 0,
            public: 0
        },
        gpu3Chart: null,
        processList: [],
        handle: 0,
        foldHide: false,
        delay: 0,
        paused: false,
        pauseKeyBound: false,
        remove: () => {
            apps.taskmgr.paused = false;
            apps.taskmgr.loaded = false;
            window.clearInterval(apps.taskmgr.handle);
            if (apps.taskmgr.preLoaded == true) {
                apps.taskmgr.preLoaded = false;
                apps.taskmgr.load(false);
            }
            else {
                apps.taskmgr.preLoaded = false;
            }
        },
        init: () => {
            apps.taskmgr.bindPauseKey();
            window.setTimeout(() => {
                $('#win-taskmgr>.menu>list.focs>a')[0].click();
            }, 200);
        },
        bindPauseKey: () => {
            if (apps.taskmgr.pauseKeyBound) {
                return;
            }

            apps.taskmgr._pauseKeyDownHandler = (event) => {
                if (event.key == 'Control' && $('.window.taskmgr.foc')[0]) {
                    apps.taskmgr.paused = true;
                }
            };
            apps.taskmgr._pauseKeyUpHandler = (event) => {
                if (event.key == 'Control') {
                    apps.taskmgr.paused = false;
                }
            };
            apps.taskmgr._pauseBlurHandler = () => {
                apps.taskmgr.paused = false;
            };

            document.addEventListener('keydown', apps.taskmgr._pauseKeyDownHandler);
            document.addEventListener('keyup', apps.taskmgr._pauseKeyUpHandler);
            window.addEventListener('blur', apps.taskmgr._pauseBlurHandler);
            apps.taskmgr.pauseKeyBound = true;
        },
        fold: () => {
            if (!apps.taskmgr.foldHide) {
                window.setTimeout(() => {
                    $('#win-taskmgr>.menu>.focs>a>p').hide();
                }, 50);
                $('#win-taskmgr')[0].style.gridTemplateColumns = '78px auto';
            }
            else {
                window.setTimeout(() => {
                    $('#win-taskmgr>.menu>.focs>a>p').show();
                }, 100);
                $('#win-taskmgr')[0].style.gridTemplateColumns = '320px auto';
            }
            apps.taskmgr.foldHide = !apps.taskmgr.foldHide;
        },
        load: (init_all = true) => {
            if (init_all == true) {
                const performance = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph')[0];
                performance.$$('.graph-cpu>.information>.left>div:nth-child(3)>.value')[0].innerText = apps.taskmgr.tasks.length;

                apps.taskmgr.cpuChart = performance.$$('.graph-cpu>.graph>.chart')[0];
                apps.taskmgr.cpuBg = performance.$$('.graph-cpu>.graph>.bg')[0];
                apps.taskmgr.cpuBg.innerHTML = '<g class="col"></g><g class="row"></g>';
                apps.taskmgr.cpuChart.innerHTML = '<path d="M 6000 1000" stroke="#2983cc" stroke-width="3px" fill="#2983cc22" />';

                apps.taskmgr.memoryChart = performance.$$('.graph-memory>.graph>.chart')[0];
                apps.taskmgr.memoryBg = performance.$$('.graph-memory>.graph>.bg')[0];
                apps.taskmgr.memoryBg.innerHTML = '<g class="col"></g><g class="row"></g>';
                apps.taskmgr.memoryChart.innerHTML = '<path d="M 6000 1000" stroke="#660099" stroke-width="3px" fill="#66009922" />';

                apps.taskmgr.memory2Elt = performance.$$('.graph-memory>.graph2>.chart')[0];

                apps.taskmgr.diskChart = performance.$$('.graph-disk>.graph>.chart')[0];
                apps.taskmgr.diskBg = performance.$$('.graph-disk>.graph>.bg')[0];
                apps.taskmgr.diskBg.innerHTML = '<g class="col"></g><g class="row"></g>';
                apps.taskmgr.diskChart.innerHTML = '<path d="M 6000 1000" stroke="#008000" stroke-width="3px" fill="#00800022" />';

                apps.taskmgr.disk2Chart = performance.$$('.graph-disk>.graph2>.chart')[0];
                apps.taskmgr.disk2Bg = performance.$$('.graph-disk>.graph2>.bg')[0];
                apps.taskmgr.disk2Bg.innerHTML = '<g class="col"></g><g class="row"></g>';
                apps.taskmgr.disk2Chart.innerHTML = '<path d="M 6000 1000" stroke="#008000" stroke-width="3px" fill="#00800022" /><path d="M 6000 1000" stroke="#008000" stroke-width="3px" fill="none" stroke-dasharray="15, 15" />';

                apps.taskmgr.wifiChart = performance.$$('.graph-wifi>.graph>.chart')[0];
                apps.taskmgr.wifiBg = performance.$$('.graph-wifi>.graph>.bg')[0];
                apps.taskmgr.wifiChart.innerHTML = '<path d="M 6000 1000" stroke="#8e5829" stroke-width="3px" fill="#8e582922" /><path d="M 6000 1000" stroke="#8e5829" stroke-width="3px" fill="none" stroke-dasharray="10, 10" />';
                apps.taskmgr.wifiBg.innerHTML = '<g class="col"></g><g class="row"></g>';

                apps.taskmgr.gpu3Chart = performance.$$('.graph-gpu>.graphs>svg')[0];
                apps.taskmgr.gpu3Chart.innerHTML = '<path d="M 6000 1000" stroke="#2983cc" stroke-width="3px" fill="#2983cc22" />';

                for (var i = 1; i <= 4; i++) {
                    apps.taskmgr.gpuChart[i - 1] = performance.$$('.graph-gpu>.graphs>.graph' + i + '>.chart>.chart')[0];
                    apps.taskmgr.gpuChart[i - 1].innerHTML = '<path d="M 6000 1000" stroke-width="3px" stroke="#2983cc" fill="#2983cc22" />';
                    apps.taskmgr.gpuBg[i - 1] = performance.$$('.graph-gpu>.graphs>.graph' + i + '>.chart>.bg')[0];
                    apps.taskmgr.gpuBg[i - 1].innerHTML = '<g class="col"></g><g class="row"></g>';
                }
                for (var i = 1; i <= 2; i++) {
                    apps.taskmgr.gpu2Chart[i - 1] = performance.$$('.graph-gpu>.gpu2-' + i + '>.chart')[0];
                    apps.taskmgr.gpu2Bg[i - 1] = performance.$$('.graph-gpu>.gpu2-' + i + '>.bg')[0];
                    apps.taskmgr.gpu2Bg[i - 1].innerHTML = '<g class="col"></g><g class="row"></g>';
                    apps.taskmgr.gpu2Chart[i - 1].innerHTML = '<path d="M 6000 1000" stroke-width="3px" stroke="#2983cc" fill="#2983cc22" />';
                }
            }

            if (apps.taskmgr.preLoaded != true && apps.taskmgr.loaded != true) {
                apps.taskmgr.gpuMemory.private = Number((Math.random() * 4).toFixed(2));
                apps.taskmgr.gpuMemory.public = Number((Math.random() * 4).toFixed(2));
                apps.taskmgr.generateProcesses();
                apps.taskmgr.sort();
                apps.taskmgr.loadProcesses();
                apps.taskmgr.performanceLoad();
            }

            if (init_all == true) {
                apps.taskmgr.gpuMemory.private = Number((Math.random() * 4).toFixed(2));
                apps.taskmgr.gpuMemory.public = Number((Math.random() * 4).toFixed(2));
                apps.taskmgr.loadProcesses();
                apps.taskmgr.generateProcesses();
                apps.taskmgr.sort();
                apps.taskmgr.performanceLoad();
                apps.taskmgr.drawGrids();
                apps.taskmgr.handle = window.setInterval(() => {
                    if (apps.taskmgr.paused) {
                        return;
                    }
                    apps.taskmgr.loadProcesses();
                    apps.taskmgr.generateProcesses();
                    apps.taskmgr.sort();
                    apps.taskmgr.performanceLoad();
                    apps.taskmgr.loadGraph();
                    apps.taskmgr.gridLine();
                    apps.taskmgr.memory2Elt.style.width = apps.taskmgr.memory + '%';
                }, 1000);
            }
            else if (apps.taskmgr.loaded != true && apps.taskmgr.preLoaded != true) {
                apps.taskmgr.handle = window.setInterval(() => {
                    if (apps.taskmgr.paused) {
                        return;
                    }
                    apps.taskmgr.loadProcesses();
                    apps.taskmgr.generateProcesses();
                    apps.taskmgr.sort();
                    apps.taskmgr.performanceLoad();
                }, 1000);
            }
        },
        page: (name) => {
            $('#win-taskmgr>.main>.cnt.' + name).scrollTop(0);
            $('#win-taskmgr>.main>.cnt.show').removeClass('show');
            $('#win-taskmgr>.main>.cnt.' + name).addClass('show');
            $('#win-taskmgr>.menu>list.focs>a.check').removeClass('check');
            $('#win-taskmgr>.menu>list.focs>a.' + name).addClass('check');
            if (!(name == 'processes' || name == '404')) {
                document.getElementById('tsk-search').style.display = 'none';
            } else {
                document.getElementById('tsk-search').style.display = '';
            }
        },
        graph: (name) => {
            $('#win-setting>.page>.cnt.' + name).scrollTop(0);
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.show').removeClass('show');
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.' + name).addClass('show');
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.check').removeClass('check');
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.' + name).addClass('check');
        },
        generateProcesses: () => {
            let processList = [];
            let max = 100 / apps.taskmgr.tasks.length;
            let cpusum = 0, memorysum = 0, disksum = 0, diskUsing = Number(Math.random()) > 0.7/*, color = window.getComputedStyle(page, null).getPropertyValue('--href')*/;
            var search_len = 0;
            for (const elt of apps.taskmgr.tasks) {
                let cpu = Number((Math.random() * max).toFixed(1)),
                    memory = apps.taskmgr.memory != 0 ? apps.taskmgr.memory / apps.taskmgr.tasks.length + Number(((Math.random() - 0.5) / 5).toFixed(1)) : Number((Math.random() * max).toFixed(1)),
                    disk = Number((Math.random() * max).toFixed(1)) > (max / 1.2) && diskUsing ? max * Number(Math.random().toFixed(1)) : 0;
                cpusum = Number((cpusum + cpu).toFixed(1));
                memorysum = Number((memorysum + memory).toFixed(1));
                disksum = Number((disksum + disk).toFixed(1));
                if (document.getElementById('tsk-search').value != '' && document.getElementById('tsk-search').style.display == '' && (!elt.name.toLowerCase().includes(document.getElementById('tsk-search').value.toLowerCase()))) {
                    continue;
                }
                processList.splice(processList.length, 0, {
                    name: elt.name,
                    icon: elt.icon || '',
                    system: elt.system,
                    cpu: cpu,
                    memory: memory,
                    disk: disk
                });
                search_len++;
            }
            if (search_len == 0) {
                apps.taskmgr.page('404');
            }
            else {
                if ($('#tsk-search').val() != '' && $('#tsk-search')[0].style.display == '') {
                    apps.taskmgr.page('processes');
                }
            }
            apps.taskmgr.cpu = cpusum;
            apps.taskmgr.memory = memorysum;
            apps.taskmgr.disk = disksum;
            apps.taskmgr.processList = processList;

        },
        loadProcesses: (processList = apps.taskmgr.processList) => {
            const processContainer = $('#win-taskmgr>.main>.cnt.processes tbody.view')[0];
            const values = $('#win-taskmgr>.main>.cnt.processes thead>tr>th>.value');
            const cpu = values[0], memory = values[1], disk = values[2];
            let selected;
            if ($('#win-taskmgr>.main>.cnt.processes tbody.view>tr.select>td:first-child>.text')[0]) {
                selected = $('#win-taskmgr>.main>.cnt.processes tbody.view>tr.select>td:first-child>.text')[0].innerText;
            }
            let max = 100 / apps.taskmgr.tasks.length;
            processContainer.innerHTML = '';
            for (const elt of processList) {
                const newElt = document.createElement('tr');
                newElt.classList.add('notrans');
                newElt.innerHTML = `<td><div class="text"><div class="icon" style="background-image: url('${elt.icon ? elt.icon : ''}');"></div>${elt.name}</div></td><td style="text-align: right;background-color: color-mix(in srgb, var(--theme-2) ${elt.cpu >= (max / 1.3) ? '75%' : '50%'}, transparent);">${elt.cpu.toFixed(1)}%</td><td style="text-align: right;background-color: color-mix(in srgb, var(--theme-2) ${elt.memory >= (max / 1) ? '75%' : '50%'}, transparent);">${elt.memory.toFixed(1)}%</td><td style="text-align: right;background-color: color-mix(in srgb, var(--theme-2) ${elt.disk >= (max / 1.3) ? '75%' : '50%'}, transparent);">${elt.disk.toFixed(1)}%</td><td>${['Very Low', 'Very Low', 'Very Low', 'Low', 'Medium'][Math.floor(Math.random() * 5)]}</td>`;
                if (elt.name == selected) {
                    newElt.classList.add('select');
                }
                processContainer.appendChild(newElt);
                newElt.onclick = function () {
                    apps.taskmgr.selectProcess(this);
                };
                newElt.oncontextmenu = function (e) {
                    return showcm(e, 'taskmgr.processes', elt.name);
                };
                window.setTimeout(() => {
                    newElt.classList.remove('notrans');
                }, 100);
            }
            cpu.innerText = apps.taskmgr.cpu.toFixed(1) + '%';
            memory.innerText = apps.taskmgr.memory.toFixed(1) + '%';
            disk.innerText = apps.taskmgr.disk.toFixed(1) + '%';
        },
        sort: (processList = apps.taskmgr.processList, type = apps.taskmgr.sortType, order = apps.taskmgr.sortOrder) => {
            processList.sort((a, b) => {
                if (a[type] > b[type]) {
                    return order == 'up-down' ? -1 : 1;
                }
                else if (a[type] <= b[type]) {
                    return order == 'up-down' ? 1 : -1;
                }
            });
            apps.taskmgr.processList = processList;
        },
        performanceLoad: () => {
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(1)>.value')[0].innerText = `${apps.taskmgr.cpu.toFixed(1)}%`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(2)>.value')[0].innerText = `${(3200 / 100 * apps.taskmgr.cpu).toFixed(1)} GHz`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(4)>.value')[0].innerText = `${apps.taskmgr.tasks.length * (5 + Math.floor(Math.random() * 5))}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(5)>.value')[0].innerText = `${apps.taskmgr.tasks.length * (10 + Math.floor(Math.random() * 20))}`;
            let sec = apps.taskmgr.cpuRunningTime;
            let min = Math.floor(sec / 60);
            sec %= 60;
            let hour = Math.floor(min / 60);
            min %= 60;
            let day = Math.floor(hour / 24);
            hour %= 24;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(6)>.value')[0].innerText = `${day}:${String(hour).length < 2 ? '0' : ''}${hour}:${String(min).length < 2 ? '0' : ''}${min}:${String(sec).length < 2 ? '0' : ''}${sec}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-cpu>.right>.data>.value1')[0].innerText = `${apps.taskmgr.cpu.toFixed(1)}%`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-cpu>.right>.data>.value2')[0].innerText = `${(3200 / 100 * apps.taskmgr.cpu).toFixed(1)}GHz`;

            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory>.information>.left>div:nth-child(1)>.value')[0].innerText = `${apps.taskmgr.memory.toFixed(1)} GB (0 MB)`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory>.information>.left>div:nth-child(2)>.value')[0].innerText = `${(100 - apps.taskmgr.memory).toFixed(1)} GB`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory>.information>.left>div:nth-child(3)>.value')[0].innerText = `${(apps.taskmgr.memory - 2).toFixed(1)} / 100 GB`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory>.information>.left>div:nth-child(4)>.value')[0].innerText = `${(apps.taskmgr.memory / 2).toFixed(2)} GB`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-memory>.right>.data>.value1')[0].innerText = `${apps.taskmgr.memory.toFixed(1)} / 100 GB`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-memory>.right>.data>.value2')[0].innerText = `${apps.taskmgr.memory.toFixed(1)}%`;

            apps.taskmgr.diskSpeed.read = apps.taskmgr.disk != 0 ? (Math.random() * 100).toFixed(2) : 0;
            apps.taskmgr.diskSpeed.write = apps.taskmgr.disk != 0 ? (Math.random() * 100).toFixed(2) : 0;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk>.information>.left>div:nth-child(1)>.value')[0].innerText = `${apps.taskmgr.disk}%`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk>.information>.left>div:nth-child(2)>.value')[0].innerText = `${apps.taskmgr.disk != 0 ? Math.random().toFixed(2) : 0} ${lang('ms', 'taskmgr.disk-latency')}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk>.information>.left>div:nth-child(3)>.value')[0].innerText = `${apps.taskmgr.diskSpeed.read} ${apps.taskmgr.disk != 0 ? lang('MB/sec', 'taskmgr.disk-speed-mb') : lang('KB/sec', 'taskmgr.disk-speed-kb')}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk>.information>.left>div:nth-child(4)>.value')[0].innerText = `${apps.taskmgr.diskSpeed.write} ${apps.taskmgr.disk != 0 ? lang('MB/sec', 'taskmgr.disk-speed-mb') : lang('KB/sec', 'taskmgr.disk-speed-kb')}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-disk>.right>.data>.value2')[0].innerText = `${apps.taskmgr.disk}%`;

            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-gpu>.right>.data>.value2')[0].innerText = `${apps.taskmgr.gpu.usage.toFixed(1)}%`;

            apps.taskmgr.gpu.d3 = Number((Math.random() * 15).toFixed(2));
            apps.taskmgr.gpu.copy = Number((Math.random() * 15).toFixed(2));
            apps.taskmgr.gpu.videop = Number((Math.random() * 15).toFixed(2));
            apps.taskmgr.gpu.videod = Number((Math.random() * 15).toFixed(2));
            apps.taskmgr.gpu.usage = Number(((apps.taskmgr.gpu.d3 + apps.taskmgr.gpu.copy + apps.taskmgr.gpu.videop + apps.taskmgr.gpu.videod) / 4).toFixed(1));

            apps.taskmgr.wifi.receive = Number((Math.random() * 100).toFixed(2));
            apps.taskmgr.wifi.send = Number((Math.random() * 100).toFixed(2));
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-wifi>.information>.left>div:nth-child(1)>.value')[0].innerText = `${apps.taskmgr.wifi.send.toFixed(2)} Mbps`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-wifi>.information>.left>div:nth-child(2)>.value')[0].innerText = `${apps.taskmgr.wifi.receive.toFixed(2)} Mbps`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-wifi>.right>.data>.value2')[0].innerText = `${lang('Send', 'taskmgr.wifi-send')}: ${apps.taskmgr.wifi.send} ${lang('Receive', 'taskmgr.wifi-receive')}: ${apps.taskmgr.wifi.receive} Mbps`;
        },
        drawGraph: (chart, data, nth = 0) => {
            var path = $(chart.querySelectorAll('path')[nth]).attr('d');
            path = path.replace(/ L 6000 1000$/, '');
            var pathl = path.split(' ');
            var newPath = '';
            var sum = 0, head = 0;
            for (var i = 0; i < pathl.length; i += 3) {
                const arg = pathl[i];
                if (arg == 'M' && Number(pathl[i + 1]) > 0) {
                    pathl[i + 1] = Number(pathl[i + 1]) - 100;
                    pathl[i + 2] = pathl[i + 2];
                }
                else if (arg == 'M' && Number(pathl[i + 1]) <= 0) {
                    pathl[i + 1] = 0;
                    pathl[i + 2] = 1000;
                }
                else if (arg == 'L') {
                    if (sum == 0) {
                        head = i;
                    }
                    else if (sum >= 60) {
                        pathl.splice(head, 3);
                        sum--;
                        i -= 3;
                    }
                    pathl[i + 1] = Number(pathl[i + 1]) - 100;
                    sum++;
                }
            }
            pathl.push('L', '6000', 1000 - data, 'L', '6000', '1000');
            window.setTimeout(() => {
                $(chart.querySelectorAll('path')[nth]).attr('d', '');
                for (const arg of pathl) {
                    if (!(arg === '')) {
                        newPath += arg + ' ';
                    }
                }
                newPath = newPath.substring(0, newPath.length - 1);
                $(chart.querySelectorAll('path')[nth]).attr('d', newPath);
            }, apps.taskmgr.delay);
        },
        loadGraph: () => {
            apps.taskmgr.drawGraph(apps.taskmgr.cpuChart, apps.taskmgr.cpu * 10);
            apps.taskmgr.drawGraph(apps.taskmgr.memoryChart, apps.taskmgr.memory * 10);
            apps.taskmgr.drawGraph(apps.taskmgr.diskChart, apps.taskmgr.disk * 10);
            apps.taskmgr.drawGraph(apps.taskmgr.disk2Chart, apps.taskmgr.diskSpeed.read * 10, 0);
            apps.taskmgr.drawGraph(apps.taskmgr.disk2Chart, apps.taskmgr.diskSpeed.write * 10, 1);
            apps.taskmgr.drawGraph(apps.taskmgr.wifiChart, apps.taskmgr.wifi.receive * 10, 0);
            apps.taskmgr.drawGraph(apps.taskmgr.wifiChart, apps.taskmgr.wifi.send * 10, 1);
            for (var i = 0; i < 4; i++) {
                apps.taskmgr.drawGraph(apps.taskmgr.gpuChart[i], apps.taskmgr.gpu[['d3', 'copy', 'videop', 'videod'][i]] * 10);
            }
            for (var i = 0; i < 2; i++) {
                apps.taskmgr.drawGraph(apps.taskmgr.gpu2Chart[i], apps.taskmgr.gpuMemory[['private', 'public'][i]] * (i == 1 ? (1000 / 32) : (1000 / 16)));
            }
            apps.taskmgr.drawGraph(apps.taskmgr.gpu3Chart, apps.taskmgr.gpu.usage * 10);
            const menu = $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu')[0];
            menu.$$('.graph-cpu svg')[0].innerHTML = apps.taskmgr.cpuChart.innerHTML;
            menu.$$('.graph-memory svg')[0].innerHTML = apps.taskmgr.memoryChart.innerHTML;
            menu.$$('.graph-disk svg')[0].innerHTML = apps.taskmgr.diskChart.innerHTML;
            menu.$$('.graph-wifi svg')[0].innerHTML = apps.taskmgr.wifiChart.innerHTML;
            menu.$$('.graph-gpu svg')[0].innerHTML = apps.taskmgr.gpu3Chart.innerHTML;
        },
        changeSort: (elt, type) => {
            for (const _elt of $('#win-taskmgr>.main>.cnt.processes thead>tr>th>i')) {
                _elt.className = 'bi';
            }
            if (apps.taskmgr.sortOrder == 'up-down' && apps.taskmgr.sortType == type) {
                elt.className = 'bi bi-chevron-up';
                apps.taskmgr.sortOrder = 'down-up';
                apps.taskmgr.sort(apps.taskmgr.processList, type, 'down-up');
            }
            else {
                elt.className = 'bi bi-chevron-down';
                apps.taskmgr.sortOrder = 'up-down';
                apps.taskmgr.sortType = type;
                apps.taskmgr.sort(apps.taskmgr.processList, type, 'up-down');
            }
        },
        gridLine: () => {
            apps.taskmgr.changeGrids(apps.taskmgr.memoryBg);
            apps.taskmgr.changeGrids(apps.taskmgr.cpuBg);
            apps.taskmgr.changeGrids(apps.taskmgr.diskBg);
            apps.taskmgr.changeGrids(apps.taskmgr.disk2Bg);
            apps.taskmgr.changeGrids(apps.taskmgr.wifiBg);
            apps.taskmgr.gpuBg.forEach(function (chart) {
                apps.taskmgr.changeGrids(chart);
            });
            apps.taskmgr.gpu2Bg.forEach(function (chart) {
                apps.taskmgr.changeGrids(chart);
            });
        },
        selectProcess: (elt) => {
            $('#win-taskmgr>.main>.cnt.processes tbody.view>.select').removeClass('select');
            $(elt).addClass('select');
        },
        taskkill: (name) => {
            if (name == 'System') {
                window.location = 'bluescreen.html';
            }else if(name == 'Windows Logon Process'){
               window.location.reload();
            }else {
                apps.taskmgr.tasks.splice(apps.taskmgr.tasks.findIndex(elt => elt.name == name), 1);
                if (taskmgrTasks.find(elt => elt.name == name).link != null) {
                    hidewin(taskmgrTasks.find(elt => elt.name == name).link);
                }
            }
        },
        initgrids: (chart) => {
            const column = chart.querySelector('g.col'), row = chart.querySelector('g.row');
            for (var i = 0; i <= 20; i++) {
                column.innerHTML += `<path d="M ${i * 300} 0 L ${i * 300} 1000 Z" stroke="#aeaeae" fill="none" />`;
            }
            for (var i = 0; i <= 10; i++) {
                row.innerHTML += `<path d="M 0 ${i * 100} L 6000 ${i * 100} Z" stroke="#aeaeae" fill="none" />`;
            }
        },
        drawGrids: () => {
            apps.taskmgr.initgrids(apps.taskmgr.cpuBg);
            apps.taskmgr.initgrids(apps.taskmgr.diskBg);
            apps.taskmgr.initgrids(apps.taskmgr.memoryBg);
            apps.taskmgr.initgrids(apps.taskmgr.disk2Bg);
            apps.taskmgr.initgrids(apps.taskmgr.wifiBg);
            for (var i = 0; i < 4; i++) {
                apps.taskmgr.initgrids(apps.taskmgr.gpuBg[i]);
            }
            for (var i = 0; i < 2; i++) {
                apps.taskmgr.initgrids(apps.taskmgr.gpu2Bg[i]);
            }
        },
        changeGrids: (chart) => {
            const grid = chart.querySelectorAll('g.col>path');
            for (const elt of grid) {
                let path = $(elt).attr('d').split(' ');
                for (var i = 0; i < path.length; i++) {
                    if (path[i] == 'M' || path[i] == 'L') {
                        var cur = Number(path[i + 1]);
                        cur -= 100;
                        if (cur < 0) {
                            cur = (300 - (-cur)) + 6000;
                        }
                        path[i + 1] = String(cur);
                    }
                }
                $(elt).attr('d', '');
                let tmp = '';
                for (const comp of path) {
                    tmp += comp + ' ';
                }
                $(elt).attr('d', tmp);
                console.log($(elt).attr('d'));
            }
        }
    },
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
            $('#win-copilot')[0].insertAdjacentHTML('afterbegin', '<iframe src="/chatgh/copilot.html" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe>');
        }
    },
    'minesweeper': {
        init: () => {
            return null;
        },
        load: () => {
            $('#win-minesweeper')[0].insertAdjacentHTML('afterbegin', '<iframe src="https://win12-online.github.io/win12/games/minesweeper.html" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe>');
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
    explorer: {
        mounts: {},
        nextDriveLetter: 'E',
        fsApiSupported: ('showDirectoryPicker' in window),
        init: () => {
            apps.explorer.tabs = [];
            apps.explorer.len = 0;
            apps.explorer.newtab();
            // apps.explorer.reset();
            apps.explorer.Process_Of_Select = '';
            apps.explorer.is_use = 0;//千万不要删除它，它依托 bug 运行
            apps.explorer.is_use2 = 0;//千万不要删除它，它依托 bug 运行
            apps.explorer.old_name = '';
            apps.explorer.clipboard = null;
            if (!apps.explorer.fsApiSupported) $('#explorer-mount-btn').hide();
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Delete' && $('.window.foc')[0].classList[1] == 'explorer') {
                    apps.explorer.del(apps.explorer.Process_Of_Select);
                }
            });
        },
        mountDrive: async () => {
            if (!apps.explorer.fsApiSupported) { shownotice('fs-api-unsupported'); return; }
            try {
                const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
                document.body.style.cursor = 'wait';
                const letter = apps.explorer.nextDriveLetter + ':';
                apps.explorer.nextDriveLetter = String.fromCharCode(
                    apps.explorer.nextDriveLetter.charCodeAt(0) + 1);
                apps.explorer.mounts[letter] = dirHandle;
                apps.explorer.path.folder[letter] = { folder: {}, file: [], _mounted: true, _handle: dirHandle };
                if (!apps.explorer.tabs[apps.explorer.now][2].length) apps.explorer.reset();
                document.body.style.cursor = '';
            } catch (e) {
                document.body.style.cursor = '';
                if (e.name !== 'AbortError') shownotice('fs-mount-error');
            }
        },
        openMountedFile: async (path) => {
            var pathl = path.split('/');
            var fileName = pathl[pathl.length - 1];
            var ext = fileName.split('.').pop().toLowerCase();
            let tmp = apps.explorer.path;
            for (let i = 0; i < pathl.length - 1; i++) {
                tmp = tmp['folder'][pathl[i]];
            }
            var fileObj = tmp['file'].find(f => f.name === fileName);
            if (!fileObj || !fileObj._mounted || !fileObj._handle) return;
            try {
                const file = await fileObj._handle.getFile();
                const codeExts = ['js', 'ts', 'jsx', 'tsx', 'css', 'scss', 'less', 'html', 'htm', 'xml',
                    'json', 'yaml', 'yml', 'py', 'java', 'c', 'cpp', 'h', 'cs', 'go',
                    'rs', 'rb', 'php', 'sh', 'bat', 'ps1', 'sql', 'svg'];
                const notepadExts = ['txt', 'log', 'md', 'csv', 'ini', 'cfg'];
                if (codeExts.includes(ext)) {
                    const text = await file.text();
                    apps.codeEditor.open(text, fileName, fileObj._handle);
                } else if (notepadExts.includes(ext)) {
                    const text = await file.text();
                    apps.notepad._mountedFileHandle = fileObj._handle;
                    apps.notepad._dirty = false;
                    apps.notepad._loading = true;
                    if ($('#taskbar>.notepad').length != 0) {
                        $('#win-notepad>.text-box')[0].innerText = text;
                        if ($('.window.notepad').hasClass('min')) minwin('notepad');
                        focwin('notepad');
                        requestAnimationFrame(() => { apps.notepad._loading = false; });
                    } else {
                        apps.notepad._pendingContent = text;
                        openapp('notepad');
                    }
                    $('.window.notepad>.titbar>p').text(fileName);
                    apps.notepad.setMdMode(ext === 'md');
                } else if (['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'ico'].includes(ext)) {
                    const url = URL.createObjectURL(file);
                    apps.imgviewer.open(url, fileName);
                } else if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv'].includes(ext)) {
                    const url = URL.createObjectURL(file);
                    apps.mediaplayer.open(url, fileName, 'video', true);
                } else if (['mp3', 'wav', 'flac', 'ogg', 'aac', 'wma', 'm4a'].includes(ext)) {
                    const url = URL.createObjectURL(file);
                    apps.mediaplayer.open(url, fileName, 'audio', true);
                } else if (ext === 'pdf') {
                    const url = URL.createObjectURL(file);
                    apps.pdfviewer.open(url, fileName);
                } else {
                    shownotice('unsupported-file-type');
                }
            } catch (e) {
                shownotice('file-read-error');
            }
        },
        unmountDrive: (letter) => {
            delete apps.explorer.mounts[letter];
            delete apps.explorer.path.folder[letter];
            if (!apps.explorer.tabs[apps.explorer.now][2].length) apps.explorer.reset();
            else if (apps.explorer.tabs[apps.explorer.now][2].startsWith(letter)) apps.explorer.reset();
        },
        populateFromHandle: async (dirHandle, targetObj) => {
            targetObj.folder = {};
            targetObj.file = [];
            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'directory') {
                    targetObj.folder[entry.name] = { folder: {}, file: [], _mounted: true, _handle: entry };
                } else {
                    const ext = entry.name.split('.').pop().toLowerCase();
                    let ico = 'assets/icons/files/none.png';
                    if (['txt', 'log', 'md', 'csv', 'ini', 'cfg'].includes(ext)) ico = 'assets/icons/files/txt.png';
                    else if (['js', 'ts', 'jsx', 'tsx', 'css', 'scss', 'less', 'html', 'htm', 'xml',
                              'json', 'yaml', 'yml', 'py', 'java', 'c', 'cpp', 'h', 'cs', 'go',
                              'rs', 'rb', 'php', 'sh', 'bat', 'ps1', 'sql'].includes(ext)) ico = 'assets/icons/files/txt.png';
                    else if (['png', 'jpg', 'bmp', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'tiff'].includes(ext)) ico = 'assets/icons/files/picture.png';
                    else if (['doc', 'docx', 'rtf', 'odt'].includes(ext)) ico = 'assets/icons/files/word.png';
                    else if (['xls', 'xlsx', 'ods'].includes(ext)) ico = 'assets/icons/files/excel.png';
                    else if (['ppt', 'pptx', 'odp'].includes(ext)) ico = 'assets/icons/files/ppt.png';
                    else if (['mp3', 'wav', 'flac', 'ogg', 'aac', 'wma', 'm4a'].includes(ext)) ico = 'assets/icons/files/music.png';
                    else if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'webm', 'flv'].includes(ext)) ico = 'assets/icons/files/vidio.png';
                    else if (['exe', 'msi'].includes(ext)) ico = 'assets/icons/files/exefile.png';
                    else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) ico = 'assets/icons/files/none.png';
                    else if ('pdf' === ext) ico = 'assets/icons/files/pdf.svg';
                    targetObj.file.push({ name: entry.name, ico: ico, command: '', _handle: entry, _mounted: true });
                }
            }
        },
        tabs: [],
        now: null,
        len: 0,
        newtab: (path = '') => {
            m_tab.newtab('explorer', '');
            apps.explorer.tabs[apps.explorer.tabs.length - 1][2] = path;
            apps.explorer.initHistory(apps.explorer.tabs[apps.explorer.tabs.length - 1][0]);
            apps.explorer.checkHistory(apps.explorer.tabs[apps.explorer.tabs.length - 1][0]);
            m_tab.tab('explorer', apps.explorer.tabs.length - 1);
            // }
        },
        settab: (t, i) => {
            return `
                <div class="tab ${t[0]}" onclick="m_tab.tab('explorer',${i})"
                oncontextmenu="showcm(event,'explorer.tab',${i});stop(event);return false"
                onmousedown="
                    if(event.button==1){m_tab.close('explorer',${i});stop(event);}
                    else{m_tab.moving('explorer',this,event,${i});stop(event);disableIframes();}"
                ontouchstart="m_tab.moving('explorer',this,event,${i});stop(event);disableIframes();">
                    <p>${t[1]}</p>
                    <span class="clbtn bi bi-x" onclick="m_tab.close('explorer',${i});stop(event);"></span>
                </div>`;
        },
        tab: (c, load = true) => {
            if (load) {
                console.log(c);
                if (!apps.explorer.tabs[c][2].length) apps.explorer.reset();
                else apps.explorer.goto(apps.explorer.tabs[c][2]);
            }
            apps.explorer.checkHistory(apps.explorer.tabs[c][0]);
        },
        reset: (clear = true) => {
            let resetHtml = `<style>#win-explorer>.page>.main>.content>.view>.class{margin: 5px 0 0 10px;display: flex;}
            #win-explorer>.page>.main>.content>.view>.class>img{width: 20px;height: 20px;margin-top: 3px;margin-right: 5px;filter:brightness(0.9);}
            #win-explorer>.page>.main>.content>.view>.group{display: flex;flex-wrap: wrap;padding: 10px 20px;}
            #win-explorer>.page>.main>.content>.view>.group>.item{width: 280px;margin: 5px;height:80px;
    box-shadow: 0 1px 2px var(--s3d);
                background: radial-gradient(circle, var(--card),var(--card));border-radius: 10px;display: flex;}
            #win-explorer>.page>.main>.content>.view>.group>.item:hover{background-color: var(--hover);}

            #win-explorer>.page>.main>.content>.view>.group>.item>img{width: 55px;height: 55px;margin-top: 18px;margin-left: 10px;}
            #win-explorer>.page>.main>.content>.view>.group>.item>div{flex-grow: 1;padding: 5px 5px 0 0;}
            #win-explorer>.page>.main>.content>.view>.group>.item>div>.bar{width: calc(100% - 10px);height: 8px;border-radius: 10px;
                background-color: var(--hover-b);margin: 5px 5px;}
            #win-explorer>.page>.main>.content>.view>.group>.item>div>.bar>.content{height: 100%;background-image: linear-gradient(90deg, var(--theme-1), var(--theme-2));
                border-radius: 10px;}
            #win-explorer>.page>.main>.content>.view>.group>.item>div>.info{color: #959595;font-size: 14px;}</style>
            <p class="class"><img src="apps/icons/explorer/disk.svg"> ${lang('Devices and Drives', 'explorer.devices')}</p><div class="group">
            <a class="a item act" ondblclick="apps.explorer.goto('C:')" ontouchend="apps.explorer.goto('C:')" oncontextmenu="showcm(event,'explorer.folder','C:');return stop(event);">
            <img src="apps/icons/explorer/diskwin.svg"><div><p class="name">${lang('Local Disk (C:)', 'explorer.localdisk-c')}</p>
            <div class="bar"><div class="content" style="width: 88%;"></div>
            </div><p class="info">32.6 GB available, 143 GB total</p></div></a><a class="a item act" ondblclick="apps.explorer.goto('D:')" ontouchend="apps.explorer.goto('D:')"
            oncontextmenu="showcm(event,'explorer.folder','D:');return stop(event);">
            <img src="apps/icons/explorer/disk.svg"><div><p class="name">${lang('Local Disk (D:)', 'explorer.localdisk-d')}</p><div class="bar"><div class="content" style="width: 15%;"></div>
            </div><p class="info">185.3 GB available, 216 GB total</p></div></a>`;
            for (let letter in apps.explorer.mounts) {
                const handle = apps.explorer.mounts[letter];
                resetHtml += `<a class="a item act" ondblclick="apps.explorer.goto('${letter}')" ontouchend="apps.explorer.goto('${letter}')" oncontextmenu="showcm(event,'explorer.mounted','${letter}');return stop(event);">
                <img src="apps/icons/explorer/disk.svg"><div><p class="name">${handle.name} (${letter})</p>
                <div class="bar"><div class="content" style="width: 0%;"></div>
                </div><p class="info">Local Folder</p></div></a>`;
            }
            resetHtml += `</div>`;
            $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = resetHtml;
            $('#win-explorer>.path>.tit')[0].innerHTML = `<div class="icon" style="background-image: url('./apps/icons/explorer/thispc.svg')"></div><div class="path"><div class="text" onclick="apps.explorer.reset()">${lang('This PC', 'explorer.thispc')}</div><div class="arrow">&gt;</div></div>`;
            // if(rename){
            m_tab.rename('explorer', '<img src="./apps/icons/explorer/thispc.svg"> ' + lang('This PC', 'explorer.thispc'));
            apps.explorer.tabs[apps.explorer.now][2] = '';
            if (clear) {
                apps.explorer.delHistory(apps.explorer.tabs[apps.explorer.now][0]);
                apps.explorer.pushHistory(apps.explorer.tabs[apps.explorer.now][0], 'This PC');
            }
            // }
        },
        select: (path, id) => {
            var elements = document.querySelectorAll('#win-explorer > .main > .content > .view > .select');
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('select');
            }
            apps.explorer.Process_Of_Select = path;
            var element = document.getElementById(id);
            element.classList.add('select');
            apps.explorer.is_use += 1;
        },
        copy_or_cut: (path, operate) => { //operate 只能为 copy 或 cut
            var pathl = path.split('/');
            var name = pathl[pathl.length - 1];
            pathl.pop();
            let files = apps.explorer.getPath();
            let tmp = null;
            pathl.forEach(name => {
                if (tmp !== null) {
                    tmp = tmp['folder'][name];
                } else {
                    tmp = files['folder'][name];
                }
            });

            if (Object.keys(tmp['folder']).includes(name)) {
                apps.explorer.clipboard = ['folder', [name], tmp['folder'][name]];
                if (operate == 'cut') {
                    delete tmp['folder'][name];
                }
            }
            else {
                for (var i = 0; i < tmp['file'].length; i++) {
                    if (tmp['file'][i]['name'] == name) {
                        apps.explorer.clipboard = ['file', tmp['file'][i]];
                        if (operate == 'cut') {
                            tmp['file'].splice(i, 1); // Use splice instead of delete
                        }
                        break;
                    }
                }
            }
            apps.explorer.pushLocalStoragePath(files, true)
        },
        paste: (path) => {
            if (!apps.explorer.clipboard) {
                return;
            }
            var pathl = path.split('/');
            let files = apps.explorer.getPath();
            let tmp = null;
            pathl.forEach(name => {
                if (tmp !== null) {
                    tmp = tmp['folder'][name];
                } else {
                    tmp = files['folder'][name];
                }
            });

            var clipboard = apps.explorer.clipboard;
            if (clipboard[0] == 'file') {
                // Check for duplicate file name
                if (tmp['file'] != null && tmp['folder'] != null) {
                    if (tmp['file'].some(file => file.name === clipboard[1].name) && (tmp['folder'][clipboard[1][0]])) {
                        shownotice('duplication file name');
                        return;
                    }
                } else if (tmp['file'] == null && tmp['folder'] != null) {
                    if (tmp['folder'][clipboard[1][0]]) {
                        shownotice('duplication file name');
                        return;
                    } else {
                        tmp['file'] = []
                    }
                } else if (tmp['file'] != null && tmp['folder'] == null) {
                    if (tmp['file'].some(file => file.name === clipboard[1].name)) {
                        shownotice('duplication file name');
                        return;
                    };
                };
                tmp['file'].push({ ...clipboard[1] }); // Create a copy of the file object
            } else {
                // Check for duplicate folder name
                if (tmp['folder'][clipboard[1][0]]) {
                    shownotice('duplication file name');
                    return;
                }
                tmp['folder'][clipboard[1][0]] = JSON.parse(JSON.stringify(clipboard[2])); // Deep copy the folder
            }
            apps.explorer.goto(path);
            apps.explorer.pushLocalStoragePath(files, true)
        },
        del_select: () => {
            if (apps.explorer.is_use >= 1 && apps.explorer.is_use2 != apps.explorer.is_use) {
                apps.explorer.is_use2 = apps.explorer.is_use;
                return;
            }
            var elements = document.querySelectorAll('#win-explorer>.page>.main>.content>.view>.change');
            console.log(elements);
            for (var i = 0; i < elements.length; i++) {
                var name_1, icon_;
                elements[i].classList.remove('change');
                let aTag = elements[i];
                var on = apps.explorer.old_name;
                let inputTag = aTag.querySelector('#new_name');
                var pathl = $('#win-explorer>.path>.tit')[0].dataset.path.split('/');
                let files = apps.explorer.getPath();
                let tmp = files;
                pathl.forEach(name => {
                    if (tmp !== null) {
                        tmp = tmp['folder'][name];
                    } else {
                        tmp = files['folder'][name];
                    }
                });
                if (inputTag.value == '' || apps.explorer.traverseDirectory(tmp, inputTag.value) || on == inputTag.value) {
                    if (apps.explorer.traverseDirectory(tmp, inputTag.value) && on != inputTag.value) {
                        shownotice('duplication file name');
                    }
                    var element = document.getElementById('new_name');
                    element.parentNode.removeChild(element);
                    aTag.innerHTML += on;
                    continue;
                }
                name_1 = inputTag.value.split('.');
                if (name_1[0].indexOf('/') > -1) alert(lang('Congratulations, you found this bug, but I am too lazy to fix it lol', 'easter.bug-found'));
                console.log(name_1);
                if (name_1[1] == 'txt') {
                    icon_ = 'assets/icons/files/txt.png';
                }
                else if (name_1[1] == 'png' || name_1[1] == 'jpg' | name_1[1] == 'bmp') {
                    icon_ = 'assets/icons/files/picture.png';
                }
                else {
                    icon_ = 'assets/icons/files/none.png';
                }
                //这边可以适配更多的文件类型

                aTag.innerHTML += inputTag.value;
                var isMountedRename = !!apps.explorer.mounts[pathl[0]];
                for (var j = 0; j < tmp['file'].length; j++) {
                    if (tmp['file'][j]['name'] == on) {
                        tmp['file'][j]['name'] = inputTag.value;
                        tmp['file'][j]['ico'] = icon_;
                        if (isMountedRename && tmp._handle) {
                            (async () => {
                                try {
                                    const oldHandle = await tmp._handle.getFileHandle(on);
                                    const file = await oldHandle.getFile();
                                    const newHandle = await tmp._handle.getFileHandle(inputTag.value, { create: true });
                                    const writable = await newHandle.createWritable();
                                    await writable.write(await file.arrayBuffer());
                                    await writable.close();
                                    await tmp._handle.removeEntry(on);
                                    tmp['file'][j]._handle = newHandle;
                                } catch (e) {
                                    console.warn('Rename on mounted FS failed:', e);
                                }
                            })();
                        }
                    }
                }
                const keys = Object.keys(tmp['folder']);
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i] == on) {
                        keys[i] = inputTag.value;
                        tmp['folder'][inputTag.value] = tmp['folder'][on];
                        delete tmp['folder'][on];
                    }
                }
                element = document.getElementById('new_name');
                element.parentNode.removeChild(element);
                apps.explorer.pushLocalStoragePath(files, true)
            }
            apps.explorer.is_use2 = apps.explorer.is_use;
            elements = document.querySelectorAll('#win-explorer>.page>.main>.content>.view>.select');
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('select');
            }
            apps.explorer.Process_Of_Select = '';
        },
        goto: (path, clear = true) => {
            if (path == 'This PC') { apps.explorer.reset(clear); return null; }
            var pathl = path.split('/');
            if (apps.explorer.mounts[pathl[0]]) {
                apps.explorer._gotoAsync(path, clear, !clear);
            } else {
                apps.explorer._gotoSync(path, clear);
            }
        },
        _gotoAsync: async (path, clear, forceRefresh = false) => {
            $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = '<p class="info" style="opacity:0.6;">' + lang('Loading...', 'explorer.loading') + '</p>';
            var pathl = path.split('/');
            let tmp = apps.explorer.path;
            try {
                for (let i = 0; i < pathl.length; i++) {
                    tmp = tmp['folder'][pathl[i]];
                    const needLoad = Object.keys(tmp.folder).length === 0 && tmp.file.length === 0;
                    if (tmp._mounted && tmp._handle && (needLoad || (forceRefresh && i === pathl.length - 1))) {
                        await apps.explorer.populateFromHandle(tmp._handle, tmp);
                    }
                }
                apps.explorer._gotoSync(path, clear);
            } catch (e) {
                $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = '<p class="info">' + lang('Unable to read this folder.', 'explorer.cannotread') + '</p>';
            }
        },
        _gotoSync: (path, clear = true) => {
            apps.explorer.Process_Of_Select = '';
            $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = '';
            var pathl = path.split('/');
            var pathqwq = '';
            var index_ = 0;
            let tmp = apps.explorer.getPath();
            if (path == 'This PC') {
                apps.explorer.reset(clear);
                return null;
            }
            $('#win-explorer>.path>.tit')[0].dataset.path = path;
            $('#win-explorer>.path>.tit>.path')[0].innerHTML = '<div class="text" onclick="apps.explorer.reset()">' + lang('This PC', 'explorer.thispc') + '</div><div class="arrow">&gt;</div>';
            $('#win-explorer>.path>.tit>.icon')[0].style.marginTop = '0px';
            if (pathl[pathl.length - 1] == 'C:') {
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("apps/icons/explorer/diskwin.svg")';
                $('#win-explorer>.path>.tit>.icon')[0].style.marginTop = '2.5px';
                m_tab.rename('explorer', '<img src="./apps/icons/explorer/diskwin.svg" style="margin-top:2.5px">' + pathl[pathl.length - 1]);
            }
            else if (pathl[pathl.length - 1] == 'D:') {
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("apps/icons/explorer/disk.svg")';
                m_tab.rename('explorer', '<img src="./apps/icons/explorer/disk.svg">' + pathl[pathl.length - 1]);
            }
            else if (apps.explorer.mounts[pathl[pathl.length - 1]]) {
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("apps/icons/explorer/disk.svg")';
                m_tab.rename('explorer', '<img src="./apps/icons/explorer/disk.svg">' + pathl[pathl.length - 1]);
            }
            else {
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("apps/icons/explorer/folder.svg")';
                m_tab.rename('explorer', '<img src="./apps/icons/explorer/folder.svg">' + pathl[pathl.length - 1]);
            }
            // if(rename){
            apps.explorer.tabs[apps.explorer.now][2] = path;
            // }
            pathl.forEach(name => {
                pathqwq += name;
                $('#win-explorer>.path>.tit>.path')[0].innerHTML += `<div class="text" onclick="apps.explorer.goto('${pathqwq}')">${name}</div><div class="arrow">&gt;</div>`;
                tmp = tmp['folder'][name];
                pathqwq += '/';
            });
            var path_ = path;
            if (Object.keys(tmp['folder']) == 0 && tmp['file'].length == 0) {
                $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = '<p class="info">' + lang('This folder is empty.', 'explorer.empty') + '</p>';
            }
            else {
                let ht = '';
                for (let folder in tmp['folder']) {
                    ht += `<a class="a item files" id="file${index_}" onclick="apps.explorer.select('${path}/${folder}','file${index_}');" ondblclick="apps.explorer.goto('${path}/${folder}')" ontouchend="apps.explorer.goto('${path}/${folder}')" oncontextmenu="showcm(event,'explorer.folder','${path}/${folder}');return stop(event);">
                        <img src="apps/icons/explorer/folder.svg">${folder}</a>`;
                    index_ += 1;
                }
                if (tmp['file']) {
                    tmp['file'].forEach(file => {
                        let cmd = file['command'];
                        if (file._mounted && file._handle) {
                            cmd = `apps.explorer.openMountedFile('${path_}/${file['name']}')`;
                        }
                        ht += `<a class="a item file" id="file${index_}" onclick="apps.explorer.select('${path_}/${file['name']}','file${index_}');" ondblclick="${cmd}" ontouchend="${cmd}" oncontextmenu="showcm(event,'explorer.file','${path_}/${file['name']}');return stop(event);">
                            <img src="${file['ico']}">${file['name']}</a>`;
                        index_ += 1;
                    });
                }
                $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = ht;
            }
            if (pathl.length == 1) {
                $('#win-explorer>.path>.goback').attr('onclick', 'apps.explorer.reset()');
            } else {
                $('#win-explorer>.path>.goback').attr('onclick', `apps.explorer.goto('${path.substring(0, path.length - pathl[pathl.length - 1].length - 1)}')`);
            }

            if (clear) {
                apps.explorer.delHistory(apps.explorer.tabs[apps.explorer.now][0]);
                apps.explorer.pushHistory(apps.explorer.tabs[apps.explorer.now][0], $('#win-explorer>.path>.tit')[0].dataset.path);
            }
            apps.explorer.checkHistory(apps.explorer.tabs[apps.explorer.now][0]);
        },
        add: (path, name_, type = 'file', command = '', icon = '') => { //type 为文件类型，只有文件夹 files 和文件 file
            var pathl = path.split('/');
            var icon_ = '';
            let files = apps.explorer.getPath();
            let tmp = files;
            pathl.forEach(name => {
                if (tmp !== null) {
                    tmp = tmp['folder'][name];
                } else {
                    tmp = files['folder'][name];
                }
            });
            if (tmp == null) {
                tmp = { folder: {}, file: [] };
            }
			
    		let finalName = name_;
    		let counter = 1;
    		let baseName = name_;
    		let extension = "";
    
    		if (type === 'file' && name_.includes('.')) {
        		const lastDotIndex = name_.lastIndexOf('.');
        		baseName = name_.substring(0, lastDotIndex);
        		extension = name_.substring(lastDotIndex); // e.g., ".txt"
    		}

            while (apps.explorer.traverseDirectory(tmp, finalName)) {
              finalName = `${baseName} (${counter})${extension}`;
              counter++; 
            }

            // 检查是否是文件夹
            if (type === 'files') {
                if (icon !== '') {
                    icon_ = icon;
                } else {
                    icon_ = 'assets/icons/folder.png';
                }
                try {
                    if (isMounted && tmp._handle) {
                        tmp.folder[name_] = { folder: {}, file: [], _mounted: true };
                        tmp._handle.getDirectoryHandle(name_, { create: true }).then(h => {
                            tmp.folder[name_]._handle = h;
                        }).catch(() => shownotice('file-write-error'));
                    } else {
                        tmp.folder[name_] = { folder: {}, file: [] };
                    }
                } catch {
                    tmp = { folder: {}, file: [] };
                    tmp.folder[name_] = { folder: {}, file: [] };
                }
                apps.explorer.pushLocalStoragePath(files, true);
                apps.explorer.goto(path);
                apps.explorer.rename(path + '/' + name_);
                return;
            }

            // 处理文件
            const name_1 = name_.split('.');
            if (name_1.length < 2) {
                icon_ = 'assets/icons/files/none.png';
            }
            else if (name_1[1] === 'txt') {
                icon_ = 'assets/icons/files/txt.png';
                if (command === '') {
                    command = 'openapp(\'notepad\')';
                }
            }
            else if (['png', 'jpg', 'bmp'].includes(name_1[1])) {
                icon_ = 'assets/icons/files/picture.png';
            }
            else {
                icon_ = 'assets/icons/files/none.png';
            }

            if (icon !== '') {
                icon_ = icon;
            }

            try {
                if (isMounted && tmp._handle) {
                    var fileEntry = { name: name_, ico: icon_, command: '', _mounted: true };
                    tmp.file.push(fileEntry);
                    tmp._handle.getFileHandle(name_, { create: true }).then(h => {
                        fileEntry._handle = h;
                    }).catch(() => shownotice('file-write-error'));
                } else {
                    tmp.file.push({ name: name_, ico: icon_, command: command });
                }
            }
            catch {
                tmp = { folder: {}, file: [] };
                tmp.file = [{ name: name_, ico: icon_, command: command }];
            }
            apps.explorer.pushLocalStoragePath(files, true);
            apps.explorer.goto(path);
            apps.explorer.rename(path + '/' + name_);
        },
        rename: (path) => {
            var pathl = path.split('/');
            var name = pathl[pathl.length - 1];
            apps.explorer.old_name = name;
            pathl.pop();
            let files = apps.explorer.getPath();
            let tmp = files;
            pathl.forEach(name => {
                if (tmp !== null) {
                    tmp = tmp['folder'][name];
                } else {
                    tmp = files['folder'][name];
                }
            });
            let element = document.querySelector('#' + apps.explorer.get_file_id(name));
            console.log(element)
            console.log(apps.explorer.get_file_id(name))
            console.log(name)
            let img = element.querySelector('img').outerHTML;
            element.innerHTML = img;
            let input = document.createElement('input');
            // input.style.cssText = '';
            input.id = 'new_name';
            input.className = 'input';
            input.value = apps.explorer.old_name;
            element.appendChild(input);
            setTimeout(() => { $('#new_name').focus(); $('#new_name').select(); }, 200);

            element.classList.add('change');
            var input_ = document.getElementById('new_name');
            input_.addEventListener('keyup', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    apps.explorer.del_select();
                }
            });
            apps.explorer.pushLocalStoragePath(files, false)
        },
        get_file_id: (name) => {  //只能找到已经打开了的文件夹的元素 id
            var elements = document.getElementsByClassName('item');
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                if (element.innerText == name) {
                    return element.id;
                }
            }
        },
        del: (path) => {
            var pathl = path.split('/');
            var name = pathl[pathl.length - 1];
            var isMounted = !!apps.explorer.mounts[pathl[0]];
            pathl.pop();
            let files = apps.explorer.getPath();
            let tmp = files;
            pathl.forEach(name => {
                if (tmp !== null) {
                    tmp = tmp['folder'][name];
                } else {
                    tmp = files['folder'][name];
                }
            });
            let tmp_file = tmp['file'];
            console.log(tmp_file)
            console.log(tmp)
            for (var i = 0; i < tmp_file.length; i++) {
                if (tmp_file[i]['name'] == name) {
                    tmp_file.splice(i, 1);
                }
            }
            let tmp_files = tmp['folder'];
            delete tmp_files[name];
            if (isMounted && tmp._handle) {
                tmp._handle.removeEntry(name, { recursive: true }).catch(() => shownotice('file-write-error'));
            }
            apps.explorer.goto(pathl.join('/'));
            apps.explorer.history.forEach(item => {
                while (item.includes(path)) {
                    item.splice(item.findIndex(elt => { return elt == path; }), 1);
                }
            });
            apps.explorer.pushLocalStoragePath(files, true)
        },
        pushLocalStoragePath: (path, isRefresh = false) => {
            const pathStr = JSON.stringify(path);
            localStorage.setItem("files_path", pathStr);
            if ((isRefresh ?? false) == true) {
                apps.explorer.goto($('#win-explorer>.path>.tit')[0].dataset.path, false);
            }
        },
        getPath: () => {
            const filesPath = localStorage.getItem("files_path");
            if (filesPath !== null) {
                return JSON.parse(filesPath);
            } else {
                apps.explorer.pushLocalStoragePath(apps.explorer.path);
                return apps.explorer.path;
            };
        },
        traverseDirectory(dir, name) {
            if (dir['file'] == null || dir['folder'] == null)
                return false;
            console.log(name)
            for (var i = 0; i < dir['file'].length; i++) {
                if (dir['file'][i]['name'] == name) {
                    return true;
                }
            }
            const keys = Object.keys(dir['folder']);
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == name) {
                    return true;
                }
            }
            return false;
        },
        // 禁止奇奇怪怪的缩进！尽量压行，不要毫无意义地全部格式化和展开！ 
        // 给我看蒙了这东西，写的是啥
        path: { folder: { 'C:': { folder: { 'Program Files': { folder: { 'WindowsApps': { folder: {}, file: [] }, 'Microsoft': { folder: {}, file: [] } }, file: [{ name: 'about.exe', ico: 'assets/icons/about.svg', command: 'openapp(\'about\')' }, { name: 'setting.exe', ico: 'assets/icons/setting.svg', command: 'openapp(\'setting\')' },] }, 'Program Files (x86)': { folder: { 'Microsoft': { folder: { 'Edge': { folder: { 'Application': { folder: { 'SetupMetrics': { folder: {}, file: [] } }, file: [{ name: 'msedge.exe', ico: 'assets/icons/edge.svg', command: 'openapp(\'edge\')' }] } } } } } } }, 'Windows': { folder: { 'Boot': { folder: {}, file: [] }, 'System': { folder: {}, file: [] }, 'SysWOW64': { folder: {}, file: [] }, 'System32': { folder: {}, file: [{ name: 'calc.exe', ico: 'assets/icons/calc.svg', command: 'openapp(\'calc\')' }, { name: 'cmd.exe', ico: 'assets/icons/terminal.svg', command: 'openapp(\'terminal\')' }, { name: 'notepad.exe', ico: 'assets/icons/notepad.svg', command: 'openapp(\'notepad\')' }, { name: 'taskmgr.exe', ico: 'assets/icons/taskmgr.png', command: 'openapp(\'taskmgr\')' }, { name: 'winver.exe', ico: 'assets/icons/about.svg', command: 'openapp(\'winver\')' },] } }, file: [{ name: 'explorer.exe', ico: 'assets/icons/explorer.svg', command: 'apps.explorer.newtab()' }, { name: 'notepad.exe', ico: 'assets/icons/notepad.svg', command: 'openapp(\'notepad\')' }, { name: 'py.exe', ico: 'assets/icons/python.svg', command: 'openapp(\'python\')' },] }, '用户': { folder: { 'Administrator': { folder: { 'Recommended的项目': { folder: {}, file: [{ name: 'Bottle Cap Intro.doc', ico: 'assets/icons/files/word.png', command: 'openapp(\'word\');apps.word.edit()' }, { name: 'Bottle Cap Quality Analysis.xlsx', ico: 'assets/icons/files/excel.png', command: '' },] }, '文档': { folder: { 'IISExpress': { folder: {}, file: [] }, 'PowerToys': { folder: {}, file: [] } }, file: [{ name: 'Bottle Cap Intro.doc', ico: 'assets/icons/files/word.png', command: '' }, { name: 'Bottle Cap Quality Analysis.xlsx', ico: 'assets/icons/files/excel.png', command: '' },] }, '图片': { folder: { '本机照片': { folder: {}, file: [] }, '屏幕截图': { folder: {}, file: [] } }, file: [{ name: 'Bottle Cap Diagram.png', ico: 'assets/icons/files/img.png', command: '' }, { name: 'Coca Cola Bottle Cap.jpg', ico: 'assets/icons/files/img.png', command: '' },] }, 'AppData': { folder: { 'Local': { folder: { 'Microsoft': { folder: { 'Windows': { folder: { 'Fonts': {}, 'TaskManager': {}, 'Themes': {}, 'Shell': {}, '应用程序快捷方式': {}, } }, } }, 'Programs': { folder: { 'Python': { folder: { 'Python311': { folder: { 'DLLs': {}, 'Doc': {}, 'include': {}, 'Lib': { folder: { 'site-packages': {}, 'tkinter': {}, } }, 'libs': {}, 'Script': {}, 'share': {}, 'tcl': {}, 'Tools': {} }, file: [{ name: 'python.exe', ico: 'assets/icons/python.png', command: 'openapp(\'python\')' }] } }, } } }, 'Temp': { folder: {} }, } }, 'LocalLow': { folder: { 'Microsoft': { folder: { 'Windows': {}, } }, } }, 'Roaming': { folder: { 'Microsoft': { folder: { 'Windows': { folder: { '「开始」菜单': { folder: { '程序': { folder: {} }, } }, } }, } }, } }, }, file: [] }, '音乐': { folder: { '录音机': { folder: {}, file: [] } } } } }, '公用': { folder: { '公用文档': { folder: { 'IISExpress': { folder: {}, file: [] }, 'PowerToys': { folder: {}, file: [] } }, file: [] }, '公用图片': { folder: { '本机照片': { folder: {}, file: [] }, '屏幕截图': { folder: {}, file: [] } }, file: [] }, '公用音乐': { folder: { '录音机': { folder: {}, file: [] } } } } } } } }, file: [] }, 'D:': { folder: { 'Microsoft': { folder: {}, file: [] } }, file: [{ name: 'Bottle Cap Structure.docx', ico: 'assets/icons/files/word.png', command: '' }, { name: 'Coca Cola Cap History.pptx', ico: 'assets/icons/files/ppt.png', command: '' },] } } },
        history: [],
        historypt: [],
        initHistory: (tab) => {
            apps.explorer.history[tab] = [];
            apps.explorer.historypt[tab] = -1;
        },
        pushHistory: (tab, u) => {
            apps.explorer.history[tab].push(u);
            apps.explorer.historypt[tab]++;
        },
        topHistory: (tab) => {
            return apps.explorer.history[tab][apps.explorer.historypt[tab]];
        },
        popHistory: (tab) => {
            apps.explorer.historypt[tab]--;
            return apps.explorer.history[tab][apps.explorer.historypt[tab]];
        },
        incHistory: (tab) => {
            apps.explorer.historypt[tab]++;
            return apps.explorer.history[tab][apps.explorer.historypt[tab]];
        },
        delHistory: (tab) => {
            apps.explorer.history[tab].splice(apps.explorer.historypt[tab] + 1, apps.explorer.history[tab].length - 1 - apps.explorer.historypt[tab]);
        },
        historyIsEmpty: (tab) => {
            return apps.explorer.historypt[tab] <= 0;
        },
        historyIsFull: (tab) => {
            return apps.explorer.historypt[tab] >= apps.explorer.history[tab].length - 1;
        },
        checkHistory: (tab) => {
            if (apps.explorer.historyIsEmpty(tab)) {
                $('#win-explorer>.path>.back').addClass('disabled');
            }
            else if (!apps.explorer.historyIsEmpty(tab)) {
                $('#win-explorer>.path>.back').removeClass('disabled');
            }
            if (apps.explorer.historyIsFull(tab)) {
                $('#win-explorer>.path>.front').addClass('disabled');
            }
            else if (!apps.explorer.historyIsFull(tab)) {
                $('#win-explorer>.path>.front').removeClass('disabled');
            }
        },
        back: (tab) => {
            apps.explorer.goto(apps.explorer.popHistory(tab), false);
            apps.explorer.checkHistory(tab);
        },
        front: (tab) => {
            apps.explorer.goto(apps.explorer.incHistory(tab), false);
            apps.explorer.checkHistory(tab);
        }
    },
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
