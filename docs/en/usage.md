# Usage

> 🌐 中文版：[../zh/usage.md](../zh/usage.md)

A quick tour of using the win12 desktop once it's running.

---

## Boot and log in

1. Open the site root — the boot screen runs automatically (~2s).
2. Press **F2** during boot to enter the BIOS/SETUP screen (optional).
3. On the login screen, pick a language (bottom-right list) if you want, then
   click **Login**. The overlay fades and the desktop appears.
4. To skip login during development, append `?skip_login=1`.

---

## Desktop basics

| Action | How |
|--------|-----|
| Open an app | Double-click a desktop icon, or use the taskbar / Start |
| Right-click menu | Right-click empty desktop → Refresh, Toggle Theme, Personalization, etc. |
| Move a window | Drag its title bar |
| Running apps | Appear in the centered taskbar dock (only visible when something is open) |
| Switch language | Settings app, or the login-screen language list |

---

## Apps

Built-in apps include Settings, File Explorer, Microsoft Edge, Calculator,
Notepad, Terminal, Store, Camera, Whiteboard, Defender, Word, Copilot, an image
viewer, a media player, a code editor, and games (e.g. Minesweeper). Availability
can vary as the fork evolves.

---

## Tips

- **Something looks broken (missing icons, transparent login)?** Almost always a
  stale service worker. Reload twice, or load with `?develop=1`. See
  [Configuration](configuration.md#service-worker).
- **Editing the code?** Use `?develop=1` so the service worker doesn't serve you
  cached files.
- **Resetting state?** App state lives in `localStorage`; clearing site data
  resets the desktop, language, and theme.
