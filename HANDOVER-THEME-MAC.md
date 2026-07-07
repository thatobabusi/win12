# theme-mac Branch Handover Documentation

**Branch:** `theme-mac`  
**Last Updated:** 2026-07-07  
**Purpose:** macOS Sequoia-style glossy UI implementation

## Overview

The `theme-mac` branch implements a comprehensive macOS Sequoia-style shell with glossy, translucent design elements. This branch diverges from `main` to provide a complete macOS experience while maintaining the core Windows 12 functionality.

## Key Design Principles

1. **Glossy/Frosted Glass Effect:** All UI elements use backdrop-filter with blur, saturation, and brightness adjustments
2. **Bottom Dock:** Task switcher positioned at the bottom center (macOS standard)
3. **System Colors:** Uses official macOS Sequoia color palette
4. **Minimal Typography:** System fonts with clean, modern spacing
5. **Dark Mode Support:** Full light and dark theme support via CSS variables
6. **Login Screen:** Desktop elements hidden until authentication

## File Structure & Changes

### CSS Variables (src/styles/desktop.css: lines 8-62)

**Light Mode:**
- Primary background: `#f5f5f7` (macOS light gray)
- Secondary background: `#e8e8ed` (slightly darker gray)
- Text: `#000` (black)
- Accent colors: `#007AFF` (macOS blue), `#5856D6` (macOS purple)
- Glossy overlay: `rgba(255, 255, 255, 0.25)`
- Backdrop blur: `blur(30px) saturate(1.8) brightness(1.1)`

**Dark Mode:**
- Primary background: `#1d1d1f` (macOS dark)
- Secondary background: `#424245` (dark gray)
- Text: `#f5f5f7` (light gray)
- Glossy overlay: `rgba(66, 66, 69, 0.8)`
- Backdrop blur: `blur(30px) saturate(1.8) brightness(1.1)`

### HTML Changes (src/desktop.html)

**Removed:**
- Line 862: Error message `<h1>Cannot process desktop icons...</h1>` - not needed for macOS theme

**Structure:**
- `#dock-box` (line 788): Bottom-aligned dock container with dock items
- Dock items: Start button, Search, Widgets, Copilot, Theme toggle, Battery/Control, Date/Time
- Dock styling: 18px border radius, glossy backdrop-filter, inset highlight
- No separate menu bar - all system functions in dock

### JavaScript Changes (src/js/desktop.js)

**Desktop Icon Loading (lines 3131-3132):**
```javascript
// setIcon();//加载桌面图标 - deferred until after login
// renderPinnedTaskbarIcons(); - deferred until after login
```

**Post-Login Loading (win12FinishLogin function, lines 608-631):**
```javascript
try {
    setIcon();
} catch (error) {
    console.error('Error loading desktop icons:', error);
}
renderPinnedTaskbarIcons();
```

**Reason:** Desktop icons must not be visible on the login screen. They are loaded only after authentication succeeds.

### Boot Screen (src/boot.html)

- Light gray gradient background: `linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%)`
- Apple emoji logo for branding
- Glossy progress bar with blue-to-purple gradient
- Clean macOS-style typography and spacing
- Smooth progress animation

## CSS Implementation Details

### Dock Styling (#dock-box)

```css
#dock-box {
    position: fixed;
    bottom: 12px;
    height: 50px;
    backdrop-filter: blur(30px) saturate(1.8) brightness(1.1);
    border-radius: 18px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 1px 1px 0 rgba(255, 255, 255, 0.5);
}
```

**Key Features:**
- Centered horizontally at bottom of screen
- Glossy frosted glass with inset highlight (inset shadow creates 3D effect)
- Smooth transitions on hover
- Proper z-index (92) above other UI elements

### Dock Item Hover (lines 521-527)

On hover, dock items brighten further:
```css
backdrop-filter: blur(30px) saturate(2) brightness(1.2);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), inset 1px 1px 0 rgba(255, 255, 255, 0.6);
```

### Background (body, line 98)

```css
body {
    background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%);
}
```

Subtle diagonal gradient for depth without distraction.

## Multi-Theme Architecture

### Branching Strategy

- **main:** Core functionality, shared across all themes
- **theme-ubuntu:** Ubuntu Yaru shell with left dock
- **theme-mac:** macOS Sequoia shell with bottom dock
- **theme-windows:** (future) Windows 11+ shell with taskbar
- **codex/media-player:** Feature branch (unrelated to theming)

### Shared vs. Theme-Specific

**Shared across main branch:**
- All app implementations (File Explorer, Settings, Terminal, etc.)
- Core window management and desktop functionality
- Localization system (win12-locales submodule)
- Login/authentication system

**Theme-Specific (differs per branch):**
- Shell styling and layout (dock position, colors, backdrop effects)
- Boot screen design
- Color variables and theming
- Typography and spacing
- CSS-only changes (no JS logic changes)

### Submodule Workflow

The win12-locales submodule contains translation files. When making changes:

1. Edit files in `public/lang/` (GENERATED directory, DO NOT EDIT DIRECTLY)
2. Instead, edit translations in the submodule: `public/lang/` is output from `win12-locales`
3. Commit translation changes in the submodule first
4. Bump the submodule pointer in the main repository
5. Both commits are needed for CI to pick up changes

## Testing Checklist

Before merging back to main or deploying:

- [ ] **Boot Screen:** Loads quickly, shows progress, transitions smoothly to login
- [ ] **Login Screen:** 
  - Desktop icons NOT visible before login
  - Dock visible and interactive (theme toggle, time, etc.)
  - Backdrop blur effect visible on dock
  - Background gradient displays correctly
- [ ] **Post-Login:**
  - Desktop icons load without errors after login
  - Dock items remain visible and functional
  - Pinned taskbar items render correctly
  - All dock buttons (Start, Search, Widgets, etc.) work
- [ ] **Glossy Effects:**
  - Dock has frosted glass appearance
  - Hover effects brighten properly
  - Inset highlights visible on dock
  - Shadows render correctly
- [ ] **Theme Toggle:**
  - Dark mode switches correctly
  - Colors update smoothly
  - Backdrop filter applies in both modes
- [ ] **Responsive:**
  - Dock centers properly on all screen sizes
  - Progress bar and boot screen scale correctly
  - No overflow or positioning issues
- [ ] **Console:**
  - No JavaScript errors in browser console
  - Icon loading errors caught gracefully

## Common Pitfalls & Solutions

### Issue: Desktop Icons Visible Before Login
**Cause:** `setIcon()` and `renderPinnedTaskbarIcons()` called in page onload  
**Solution:** Comment out lines 3131-3132, add calls to `win12FinishLogin()` instead

### Issue: Dock Not Showing Glossy Effect
**Cause:** Missing backdrop-filter support or service worker caching old CSS  
**Solution:** 
1. Verify browser supports `backdrop-filter` (all modern browsers do)
2. Clear service worker: Add `?develop=1` to URL or use Ctrl+Shift+R
3. Check CSS: `backdrop-filter: blur(30px) saturate(1.8) brightness(1.1);`

### Issue: Progress Bar Not Animating on Boot
**Cause:** CSS animation keyframes not loading  
**Solution:** Rebuild with `npm run build` and hard-refresh with Ctrl+Shift+R

### Issue: Dark Mode Colors Wrong
**Cause:** CSS variables not updated for dark theme  
**Solution:** Verify `:root.dark` section in desktop.css has all color variables

## Future Development Guide

### Adding New Features to theme-mac

1. **CSS-Only Changes:** Modify `src/styles/desktop.css`
2. **HTML Structure:** Modify `src/desktop.html` (keep changes minimal)
3. **JavaScript Logic:** Avoid changes if possible; if needed, ensure they don't break theme-ubuntu or main
4. **Translations:** Edit win12-locales submodule, test with build

### Creating a New Theme

To create a new OS theme (e.g., theme-windows):

1. Branch from main: `git checkout -b theme-windows main`
2. Copy relevant CSS from theme-mac as starting point
3. Update color variables for Windows 11+ palette
4. Adjust dock/taskbar positioning (right side for Windows)
5. Create corresponding boot screen
6. Update HANDOVER-THEME-* document
7. Test thoroughly before merging back

### Syncing Changes from Main

When main receives important updates:

```bash
git fetch origin main
git merge origin/main --no-edit  # or --ff-only if rebasing
```

Resolve conflicts manually. Prioritize theme-specific CSS changes in desktop.css.

## Reference: Key Functions

### Login Flow
- `win12LoginSubmit()` - Handles login attempt (src/js/desktop.js:580)
- `win12FinishLogin()` - Shows desktop after authentication (src/js/desktop.js:608)
- `setLoginError()` - Displays login error messages (src/js/desktop.js:627)

### Desktop Setup
- `setIcon()` - Renders desktop icons (src/js/desktop.js:3011)
- `renderPinnedTaskbarIcons()` - Renders taskbar items (src/js/desktop.js:2533)
- `toggletheme()` - Switches light/dark mode (src/js/desktop.js:2949)

### Styling
- Color variables: Defined in `:root` and `:root.dark` (src/styles/desktop.css:8-62)
- Dock styling: Lines 430-526 (desktop.css)
- Boot styling: Lines 1-81 (boot.html)

## Known Limitations & Notes

- **Wallpaper:** Currently uses gradient; could be extended to support custom wallpaper images
- **Menu Bar:** Integrated into dock; no separate top menu bar like full macOS
- **Finder Integration:** Desktop icons are simplified; full Finder functionality available through app launcher
- **Animations:** Smooth transitions use CSS only (no JavaScript animations for performance)

## CI/CD Integration

The GitHub Pages deployment uses:
- Build type: workflow
- Build command: `npm run build`
- Source directory: `public/`
- Submodules: Required (set with `gh api` if deploying manually)

Deploy command (if needed):
```bash
gh api -X PUT repos/thatobabusi/win12/pages -f build_type=workflow
gh workflow run pages.yml -f ref=theme-mac
```

## Contact & Support

For questions about theme-mac development:
- Check git log for recent changes: `git log --oneline theme-mac -20`
- Review memory files in `~/.claude/projects/D--My-Software-Dev/memory/`
- Compare with theme-ubuntu branch for reference implementations
