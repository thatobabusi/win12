# Hybrid Media Player Design

## Goal

Add a polished Media Player example application to the Win12 desktop simulation. It should make the UI more demonstrative while continuing to play user-selected local audio and video files.

## Scope

- The Media Player is visible in the Start menu and uses the existing window/taskbar lifecycle.
- It presents a small default demo library with artwork and a Now Playing area.
- Demo media uses the existing bundled startup audio. Entries without bundled media are explicitly visual demo entries, not unlicensed music.
- It supports play/pause, previous/next, seeking, volume, track selection, and a playback queue.
- An **Open file** control invokes the browser file picker for local audio and video files.
- File Explorer continues to open compatible files in the same player by passing a blob URL and metadata.
- Video files replace the artwork area with a video surface.

## Architecture

The app uses the project’s established desktop composition:

- `public/desktop.html` supplies the Media Player window markup and Start-menu entry.
- `public/src/modules/apps.js` owns the `apps.mediaplayer` runtime state and media lifecycle.
- A Media Player-specific stylesheet scopes its visual rules under the player window to avoid affecting other apps.
- Existing icon lookup and `openapp('mediaplayer')` integration are reused for Start-menu, taskbar, and File Explorer launches.

## Runtime Data Flow

1. Launching from Start initializes the demo queue and selects a default track.
2. Selecting a demo item updates the Now Playing state and media element source when that item has playback media.
3. Opening a file through the player or File Explorer creates/receives a blob URL, infers audio versus video, adds or replaces the active queue item, and begins playback.
4. Controls manipulate a single active HTML media element and keep the UI progress, duration, and volume state synchronized.
5. Closing the app pauses playback and revokes temporary blob URLs created by the app.

## Error Handling

- Unsupported or unreadable media displays a concise in-app error without closing the window.
- Demo-only entries that have no bundled file remain visibly non-playable until selected behavior is defined; the initial implementation will only make media-backed items playable.
- File-picker cancellation leaves the current queue and playback unchanged.

## Testing

- Unit tests cover queue navigation, media-type selection, and cleanup of temporary URLs.
- An end-to-end test opens Media Player from Start and verifies that the player window, demo library, and Open file control appear.

## Out of Scope

- Persistent playlists, favorites, search, remote streaming, uploads, account features, and a media scanner.
