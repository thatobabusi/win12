/* global $, api, lang, localStorage, apps */
// Win12 app — Settings.
//
// Extracted from apps.js onto the kernel. Uses apps.setting.* self-references
// (resolved via the registered window.apps.setting), the global api() GitHub
// helper and lang() from desktop.js, and window.win12Native (Tauri, guarded).
// No window ops. Loaded AFTER apps.js.
(function (global) {
  // Bundled themes: no network call, so they render even if the GitHub API
  // (used by theme_get() below for community themes) is rate-limited or
  // offline. Same shape as a remote theme.json (bg/color1/color2/href).
  var localThemes = [
    {
      id: 'ubuntu',
      nameKey: 'setting.psnl.theme-ubuntu',
      bg: 'assets/images/wallpaper-ubuntu.svg',
      color1: '#E95420',
      color2: '#77216F',
      href: '#E95420',
    },
  ];

  var setting = {
        init: () => {
            $('#win-setting>.menu>list>a.home')[0].click();
            $('#win-setting>.page>.cnt.update>.setting-list>div:last-child>.alr>a.checkbox')[localStorage.getItem('autoUpdate') == 'true' ? 'addClass' : 'removeClass']('checked');
            apps.setting.checkUpdate();
            apps.setting.initAutostart();
        },
        page: (name) => {
            $('#win-setting>.page>.cnt.' + name).scrollTop(0);
            $('#win-setting>.page>.cnt.show').removeClass('show');
            $('#win-setting>.page>.cnt.' + name).addClass('show');
            $('#win-setting>.menu>list>a.check').removeClass('check');
            $('#win-setting>.menu>list>a.' + name).addClass('check');
        },
        theme_get: () => {
            // Bundled themes render immediately, no network required. Community
            // themes (below) are appended once fetched; only the loading spinner
            // gets removed, so a slow/rate-limited GitHub API never hides these.
            $('#set-theme').html(localThemes.map(t =>
                `<a class="a act" onclick="apps.setting.theme_set_local('${t.id}')" style="background-image:url('${t.bg}')">${lang(t.id, t.nameKey)}</a>`
            ).join('') + `<loading><svg width="30px" height="30px" viewBox="0 0 16 16">
            <circle cx="8px" cy="8px" r="7px" style="stroke:#7f7f7f50;fill:none;stroke-width:3px;"></circle>
            <circle cx="8px" cy="8px" r="7px" style="stroke:#2983cc;stroke-width:3px;"></circle></svg></loading>`);
            // 实时获取主题
            api('repos/tjy-gitnub/win12-theme/contents').then(res => {
                res.json().then(cs => {
                    console.log(cs);
                    cs.forEach(c => {
                        if (c.type == 'dir') {
                            api(c.url, true).then(res => {
                                res.json().then(cnt => {
                                    $('#set-theme>loading').remove();
                                    cnt.forEach(cn => {
                                        if (cn.name == 'theme.json') {
                                            $.getJSON('https://tjy-gitnub.github.io/win12-theme/' + cn.path).then(inf => {
                                                // let infjs = inf;
                                                $('#set-theme>loading').remove();
                                                $('#set-theme').append(`<a class="a act" onclick="apps.setting.theme_set('${c.name}')" style="background-image:url('https://tjy-gitnub.github.io/win12-theme/${c.name}/view.jpg')">${c.name}</a>`);
                                            });
                                        }
                                    });
                                })
                            });
                        }
                    });
                })
            });
        },
        theme_set_local: (id) => {
            const t = localThemes.find(th => th.id === id);
            if (!t) return;
            // url() inside a custom property resolves against the stylesheet that
            // *uses* var(--bgul) (styles/desktop.css), not this file — same reason
            // the :root defaults below are '../assets/...' rather than 'assets/...'.
            $(':root').css('--bgul', `url('../${t.bg}')`);
            $(':root').css('--theme-1', t.color1);
            $(':root').css('--theme-2', t.color2);
            $(':root').css('--href', t.href);
            localStorage.setItem('localTheme', id);
        },
        theme_set: (infp) => {
            api('repos/tjy-gitnub/win12-theme/contents/' + infp).then(res => {
                res.json().then(cnt => {
                    // console.log('https://api.github.com/repos/tjy-gitnub/win12-theme/contents/' + infp);
                    cnt.forEach(cn => {
                        if (cn.name == 'theme.json') {
                            $.getJSON('https://tjy-gitnub.github.io/win12-theme/' + cn.path).then(inf => {
                                let infjs = inf;
                                cnt.forEach(fbg => {
                                    console.log(fbg, infjs);
                                    if (fbg.name == infjs.bg) {
                                        $(':root').css('--bgul', `url('https://tjy-gitnub.github.io/win12-theme/${fbg.path}')`);
                                        $(':root').css('--theme-1', infjs.color1);
                                        $(':root').css('--theme-2', infjs.color2);
                                        $(':root').css('--href', infjs.href);
                                        // $('#set-theme').append(`<a class="a act" onclick="apps.setting.theme_set(\`(${inf})\`)" style="background-image:url('https://tjy-gitnub.github.io/win12-theme/${fbg.path}')">${c.name}</a>`);
                                    }
                                });
                            });
                        }
                    });
                })
            });
        },
        // 无法正常运行，待调试
        // Upstream #852: real GitHub release update check. Tauri-only (native API);
        // on the web build it stays inert and clearly marked unavailable. All
        // user-facing strings go through lang() so every locale is covered.
        checkUpdate: async (manual = false) => {
            const $update = $('#win-setting>.page>.cnt.update');
            const $notice = $update.find('.update-main .notice');
            const $detail = $update.find('.update-main .detail');
            const $button = $update.find('.update-check');
            const $release = $update.find('.update-release');

            $release.addClass('disabled').removeAttr('onclick');

            if (!(window.win12Native && window.win12Native.isTauri())) {
                $notice.text(lang('Available in the Tauri desktop app only', 'setting.upd.tauri-only'));
                $detail.text(lang('Windows Update needs the desktop app to call the GitHub release API.', 'setting.upd.tauri-only-desc'));
                $button.addClass('disabled');
                return;
            }

            $button.addClass('disabled').text(lang('Checking...', 'setting.upd.checking-btn'));
            $notice.text(lang('Checking for updates...', 'setting.upd.checking'));
            $detail.text(lang('Connecting to GitHub', 'setting.upd.connecting'));

            try {
                const result = await window.win12Native.checkAppUpdate();
                const unknown = lang('Unknown version', 'setting.upd.unknown-version');
                const currentVersion = result.current_version || unknown;
                const latestVersion = result.latest_version || unknown;
                const publishedAt = result.published_at ? new Date(result.published_at).toLocaleString() : '';
                const releaseText = result.latest_name || latestVersion;
                const curLabel = lang('Current version', 'setting.upd.current-label');

                if (result.update_available) {
                    const latLabel = lang('latest version', 'setting.upd.latest-label');
                    $notice.text(lang('Update available', 'setting.upd.available'));
                    $detail.text(`${curLabel} ${currentVersion}, ${latLabel} ${latestVersion}` +
                        (publishedAt ? `, ${lang('published', 'setting.upd.published-label')} ${publishedAt}` : ''));
                    $release.removeClass('disabled')
                        .attr('onclick', `window.open(${JSON.stringify(result.release_url)}, '_blank')`)
                        .find('div>p:first-child').text(`${lang('Get', 'setting.upd.get-release')} ${releaseText}`);
                    $release.find('div>p:last-child').text(lang('Open the latest GitHub release page to download the installer', 'setting.upd.release-open-desc'));
                }
                else {
                    $notice.text(lang("You're on the latest version", 'setting.upd.uptodate'));
                    $detail.text(`${curLabel} ${currentVersion}, ${lang('GitHub latest version', 'setting.upd.gh-latest-label')} ${latestVersion}`);
                    $release.find('div>p:first-child').text(lang('Download full content', 'setting.upd.full'));
                    $release.find('div>p:last-child').text(lang('There is no newer version than your local build', 'setting.upd.no-newer-desc'));
                }
            }
            catch (e) {
                $notice.text(lang('Could not check for updates', 'setting.upd.fail'));
                $detail.text(String(e));
            }
            finally {
                $button.removeClass('disabled').text(manual
                    ? lang('Check again', 'setting.upd.recheck')
                    : lang('Check for updates', 'setting.upd.check'));
            }
        },
        // Run-at-startup, backed by the Tauri autostart plugin (win12-desktop).
        // Tauri-only, same as checkUpdate; inert and clearly marked on the web build.
        initAutostart: async () => {
            const $toggle = $('#setting-startup-toggle');
            const $desc = $('#win-setting>.page>.cnt.apps .startup-desc');

            if (!(window.win12Native && window.win12Native.isTauri())) {
                $desc.text(lang('Available in the Tauri desktop app only', 'setting.upd.tauri-only'));
                $toggle.addClass('disabled');
                return;
            }

            try {
                const enabled = await window.win12Native.getAutostart();
                $toggle.removeClass('disabled')[enabled ? 'addClass' : 'removeClass']('checked');
            } catch (e) {
                $desc.text(String(e));
                $toggle.addClass('disabled');
            }
        },
        toggleAutostart: async () => {
            const $toggle = $('#setting-startup-toggle');
            const $desc = $('#win-setting>.page>.cnt.apps .startup-desc');
            if ($toggle.hasClass('disabled')) return;
            const enabling = !$toggle.hasClass('checked');
            $toggle.addClass('disabled');
            try {
                await window.win12Native.setAutostart(enabling);
                $toggle[enabling ? 'addClass' : 'removeClass']('checked');
                $toggle.removeClass('disabled');
            } catch (e) {
                $desc.text(String(e));
            }
        },
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('setting', setting);
  } else {
    (global.apps = global.apps || {}).setting = setting;
  }

  // Re-apply a previously chosen bundled theme on every load so the choice
  // survives reloads. Guarded: under Vitest this file is imported before the
  // jQuery stub exists, and there's nothing to re-apply there anyway.
  try {
    const saved = global.localStorage && global.localStorage.getItem('localTheme');
    if (saved && typeof $ === 'function') setting.theme_set_local(saved);
  } catch (e) { /* non-browser context */ }
})(typeof window !== 'undefined' ? window : globalThis);
