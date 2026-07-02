/* global $, lang, isTauriApp, updateAboutAppEntrypoints, marked, DOMPurify */
// Win12 app — About.
//
// Extracted from apps.js onto the kernel. Merged from upstream #845 (desktop
// About support) with our lang() i18n. Uses apps.about.* self-references
// (resolved via the registered window.apps.about) and desktop.js globals
// isTauriApp()/updateAboutAppEntrypoints(). No window ops. Loaded AFTER apps.js.
(function (global) {
  var about = {
        // Merged from upstream #845 (desktop About support), preserving our lang() i18n.
        repo: () => {
            return isTauriApp() ? 'win12-online/win12-desktop' : 'win12-online/win12';
        },
        contentSuffix: () => {
            return isTauriApp() ? 'tauri' : 'web';
        },
        contributorsSelector: () => {
            return isTauriApp() ? '#contri-desktop' : '#contri';
        },
        starSelector: () => {
            return isTauriApp() ? '#StarShowDesktop' : '#StarShow';
        },
        init: () => {
            updateAboutAppEntrypoints();
            apps.about.page('about');
            if (!$(apps.about.contributorsSelector() + '>.a').length) apps.about.get();
            if (!($(apps.about.starSelector()).html().includes(lang('Refresh', 'about.refresh')))) apps.about.get_star();
            if (isTauriApp() && !$('#ReleaseShowDesktop>details').length) apps.about.get_releases();
        },
        page: (name) => {
            const suffix = apps.about.contentSuffix();
            $('#win-about>.cnt').removeClass('show');
            $(`#win-about>.${name}-${suffix}`).addClass('show');
            $('.about-menu>a').removeClass('check');
            $(`.about-menu>.${name}`).addClass('check');
        },
        run_loading: (expr) => {
            $(expr).html(`<loading><svg width="30px" height="30px" viewBox="0 0 16 16">
            <circle cx="8px" cy="8px" r="7px" style="stroke:#7f7f7f50;fill:none;stroke-width:3px;"></circle>
            <circle cx="8px" cy="8px" r="7px" style="stroke:#2983cc;stroke-width:3px;"></circle></svg></loading>`);
        },
        escape_html: (text) => {
            return String(text || '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
        },
        render_release_body: (body) => {
            const text = body || lang('This release has no release notes.', 'about.no-release-notes');
            if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
                const html = marked.parse(text);
                return DOMPurify.sanitize(html);
            }
            return apps.about.escape_html(text).replace(/\n/g, '<br>');
        },
        get_releases: () => {
            apps.about.run_loading('#ReleaseShowDesktop');
            fetch('https://api.github.com/repos/win12-online/win12-desktop/releases')
                .then(response => response.json())
                .then(releases => {
                    setTimeout(() => {
                        $('#ReleaseShowDesktop').html('');
                        if (!Array.isArray(releases) || releases.length == 0) {
                            $('#ReleaseShowDesktop').html('<p>&emsp;&emsp;' + lang('No release notes yet.', 'about.no-releases') + '</p><a class="button" onclick="apps.about.get_releases()"><i class="bi bi-arrow-clockwise"></i> ' + lang('Refresh', 'about.refresh') + '</a>');
                            return;
                        }
                        releases.forEach((release, index) => {
                            const title = apps.about.escape_html(release.name || release.tag_name || lang('Untitled release', 'about.untitled-release'));
                            const tag = release.tag_name ? `<span>${apps.about.escape_html(release.tag_name)}</span> ` : '';
                            const date = release.published_at ? ` ${apps.about.escape_html(new Date(release.published_at).toLocaleDateString())}` : '';
                            const bodyHtml = apps.about.render_release_body(release.body);
                            $('#ReleaseShowDesktop').append(`<details ${index == 0 ? 'open' : ''}><summary>${tag}${title}${date}</summary><div class="release-body">${bodyHtml}</div></details>`);
                        });
                        $('#ReleaseShowDesktop').append('<a onclick="window.open(\'https://github.com/win12-online/win12-desktop/releases\',\'_blank\');" win12_title="https://github.com/win12-online/win12-desktop/releases" class="a jump" style="text-align: center;">' + lang('More', 'more') + '</a>');
                    }, 200);
                })
                .catch(error => {
                    console.error('Error getting release notes:', error);
                    $('#ReleaseShowDesktop').html('<div style="display: flex;"><p>&emsp;&emsp;Oops! An error occurred!</p>&emsp;<a class="button" onclick="apps.about.get_releases()"><i class="bi bi-arrow-clockwise"></i> ' + lang('Retry', 'about.retry') + '</a></div>');
                });
        },
        get: () => {
            const selector = apps.about.contributorsSelector();
            apps.about.run_loading(selector);
            // Real-time project contributors retrieval
            $.get(`https://api.github.com/repos/${apps.about.repo()}/contributors`).then(cs => {
                setTimeout(() => {
                    $(selector).html('');
                    cs.forEach(c => {
                        $(selector).append(`<a class="a" title="${c['login']}" onclick="window.open('${c['html_url']}','_blank');"><img class="avatar" src="${c['avatar_url']}" alt="${c['login']}"><span class="info"><p class="name">${c['login']}</p><p class="cbs">${lang('Contributed', 'about.contributed')} <span class="num">${c['contributions']}</span></p></span></a>`);
                    });
                    $(selector).append('<a class="button" onclick="apps.about.get()"><i class="bi bi-arrow-clockwise"></i> ' + lang('Refresh', 'about.refresh') + '</a>');
                }, 200);
            });
        },
        get_star: () => {
            const selector = apps.about.starSelector();
            apps.about.run_loading(selector);
            fetch(`https://api.github.com/repos/${apps.about.repo()}`)
                .then(response => response.json())
                .then(data => {
                    setTimeout(() => {
                        const starCount = data.stargazers_count;
                        $(selector).html('<div style="display: flex;"><p>&emsp;&emsp;' + lang('Number of Stars', 'about.stars') + ': ' + starCount + ' (Real-time data)</p>&emsp;<a class="button" onclick="apps.about.get_star()"><i class="bi bi-arrow-clockwise"></i> ' + lang('Refresh', 'about.refresh') + '</a></div>');
                    }, 200);
                })
                .catch(error => {
                    console.error('Error getting star count:', error);
                    $(selector).html('<div style="display: flex;"><p>&emsp;&emsp;Oops! An error occurred!</p>&emsp;<a class="button" onclick="apps.about.get_star()"><i class="bi bi-arrow-clockwise"></i> ' + lang('Retry', 'about.retry') + '</a></div>');
                });
        }
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('about', about);
  } else {
    (global.apps = global.apps || {}).about = about;
  }
})(typeof window !== 'undefined' ? window : globalThis);
