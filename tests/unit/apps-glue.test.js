import { describe, expect, it } from 'vitest';
import '../../public/src/core/registry.js';

// The final batch of small apps extracted from the apps.js monolith onto the
// kernel. Each should register on win12.apps and be the same object legacy
// inline handlers reach via window.apps.
import '../../public/src/apps/msstore.js';
import '../../public/src/apps/webapps.js';
import '../../public/src/apps/vscode.js';
import '../../public/src/apps/bilibili.js';
import '../../public/src/apps/copilot.js';
import '../../public/src/apps/minesweeper.js';
import '../../public/src/apps/defender.js';
import '../../public/src/apps/camera.js';
import '../../public/src/apps/pythonEditor.js';
import '../../public/src/apps/notepadFonts.js';
import '../../public/src/apps/python.js';
import '../../public/src/apps/search.js';
import '../../public/src/apps/winver.js';
import '../../public/src/apps/wsa.js';
import '../../public/src/apps/word.js';
import '../../public/src/apps/windows12.js';

const NAMES = ['msstore', 'webapps', 'vscode', 'bilibili', 'copilot', 'minesweeper',
  'defender', 'camera', 'pythonEditor', 'notepadFonts', 'python', 'search',
  'winver', 'wsa', 'word', 'windows12'];

describe('apps/* glue apps (final apps.js decomposition)', () => {
  it.each(NAMES)('%s registers and bridges to window.apps', (name) => {
    expect(window.win12.apps.has(name), name).toBe(true);
    const app = window.win12.apps.get(name);
    expect(typeof app, name).toBe('object');
    expect(window.apps[name], name).toBe(app);
  });

  it('webapps still lists the four iframe webapps', () => {
    expect(window.apps.webapps.apps).toEqual(['vscode', 'bilibili', 'copilot', 'minesweeper']);
  });
});
