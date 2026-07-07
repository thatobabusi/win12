// Activities overview (theme-ubuntu) — GNOME-style window picker.
//
// Clicking "Activities" in the top bar scales every open window (including
// minimized ones) into a grid so one can be picked; clicking a thumbnail
// focuses it, clicking elsewhere or pressing Escape exits. The real window
// elements are transformed in place — no clones, no screenshots — so the
// "thumbnails" are always live.
//
// Positioning goes through per-window CSS custom properties (--ov-top/left/
// scale) consumed by a :root.overview rule in desktop.css. That indirection
// is required: .window.min and .window.max position with !important, which
// inline styles cannot beat, but a higher-specificity !important rule can.
/* global $, wo, focwin, minwin, lang, hide_startmenu */

// Pure grid math, unit-tested: n cells in an area, near-square arrangement.
function computeOverviewLayout(n, areaW, areaH, gap = 24) {
    if (n <= 0) return [];
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const cellW = (areaW - gap * (cols + 1)) / cols;
    const cellH = (areaH - gap * (rows + 1)) / rows;
    const lastRowCount = n - (rows - 1) * cols;
    const cells = [];
    for (let i = 0; i < n; i++) {
        const c = i % cols;
        const r = Math.floor(i / cols);
        // centre each row; only the last row can be short
        const inRow = (r === rows - 1) ? lastRowCount : cols;
        const rowW = inRow * cellW + (inRow - 1) * gap;
        const rowOffset = (areaW - rowW) / 2;
        cells.push({
            x: rowOffset + c * (cellW + gap),
            y: gap + r * (cellH + gap),
            w: cellW,
            h: cellH,
        });
    }
    return cells;
}

let __overviewActive = false;

function isOverviewActive() { return __overviewActive; }

function exitOverview(focusName = null, wasMin = false) {
    if (!__overviewActive) return;
    __overviewActive = false;
    document.removeEventListener('keydown', __overviewKeydown, true);
    document.removeEventListener('click', __overviewClick, true);
    $('#overview-labels').html('').removeClass('show');
    // Swap .overview for a short-lived .ov-closing so the windows animate back
    // to their real positions before the transition rule disappears.
    $(':root').removeClass('overview').addClass('ov-closing');
    $('.window.ov-item').removeClass('ov-item').each(function () {
        this.style.removeProperty('--ov-top');
        this.style.removeProperty('--ov-left');
        this.style.removeProperty('--ov-scale');
    });
    setTimeout(() => { $(':root').removeClass('ov-closing'); }, 300);
    if (focusName) {
        if (wasMin) minwin(focusName); // restores AND focuses
        else focwin(focusName);
    }
}

function __overviewKeydown(e) {
    if (e.key === 'Escape') { e.stopPropagation(); exitOverview(); }
}

function __overviewClick(e) {
    const win = e.target.closest('.window.ov-item');
    const label = e.target.closest('.ov-label');
    e.stopPropagation();
    e.preventDefault();
    if (win) {
        exitOverview(win.dataset.ovName, win.classList.contains('min'));
    } else if (label) {
        exitOverview(label.dataset.ovName, label.dataset.ovMin === '1');
    } else if (!e.target.closest('#dock-box') && !e.target.closest('#top-bar')) {
        exitOverview();
    }
}

// Open windows, derived from the taskbar's running icons rather than the
// `wo` z-order array: minwin() calls focwin(null), whose indexOf(null) === -1
// splice corrupts `wo` (drops the last entry, inserts null), so `wo` cannot
// be trusted after any minimize. The taskbar is maintained on every
// open/close and its icon's classList carries the app name.
function overviewWindows() {
    const stateClasses = ['running', 'pinned', 'min', 'foc'];
    return [...document.querySelectorAll('#taskbar>a.running')]
        .map((a) => [...a.classList].find((c) => !stateClasses.includes(c)))
        .filter((name) => name && document.querySelector('.window.' + name));
}

function toggleOverview() {
    if (__overviewActive) { exitOverview(); return; }
    if (typeof hide_startmenu === 'function') hide_startmenu();

    const names = overviewWindows();
    __overviewActive = true;
    $(':root').addClass('overview');

    const labels = $('#overview-labels');
    labels.html('').addClass('show');

    if (names.length === 0) {
        labels.append(`<p class="ov-empty">${lang('No open windows', 'overview.empty')}</p>`);
    } else {
        // Layout area: right of the dock (58px), below the top bar (28px).
        const areaX = 58, areaY = 28;
        const areaW = window.innerWidth - areaX;
        const areaH = window.innerHeight - areaY;
        const cells = computeOverviewLayout(names.length, areaW, areaH);

        // Tag first, measure second: minimized windows are display:none until
        // the .ov-item rule (display:flex) applies, and offsetWidth on a
        // display:none element is 0.
        const els = names.map((name) => document.querySelector('.window.' + name));
        els.forEach((el, i) => {
            el.dataset.ovName = names[i];
            el.classList.add('ov-item');
        });

        els.forEach((el, i) => {
            const cell = cells[i];
            // offsetWidth/Height ignore the .min scale transform, unlike
            // getBoundingClientRect — we want the window's natural size.
            const w = el.offsetWidth || 1;
            const h = el.offsetHeight || 1;
            const s = Math.min(cell.w / w, cell.h / h, 0.9);
            const x = areaX + cell.x + (cell.w - w * s) / 2;
            const y = areaY + cell.y + (cell.h - h * s) / 2;
            el.style.setProperty('--ov-top', y + 'px');
            el.style.setProperty('--ov-left', x + 'px');
            el.style.setProperty('--ov-scale', s);

            const title = $('.window.' + names[i] + '>.titbar>p').first().text() || names[i];
            const isMin = el.classList.contains('min') ? '1' : '0';
            labels.append(`<a class="a ov-label" data-ov-name="${names[i]}" data-ov-min="${isMin}" style="left:${x}px;top:${y + h * s + 8}px;width:${w * s}px">${title}</a>`);
        });
    }

    document.addEventListener('keydown', __overviewKeydown, true);
    document.addEventListener('click', __overviewClick, true);
}

// Expose for tests and for other modules (openapp() exits the overview).
if (typeof window !== 'undefined') {
    window.win12 = window.win12 || {};
    window.win12.overview = { computeLayout: computeOverviewLayout, isActive: isOverviewActive };
}
