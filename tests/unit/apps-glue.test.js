import { describe, expect, it } from 'vitest';
import '../../public/js/core/registry.js';

// The final batch of small apps extracted from the apps.js monolith onto the
// kernel. Each should register on win12.apps and be the same object legacy
// inline handlers reach via window.apps.
import '../../public/js/apps/msstore.js';
import '../../public/js/apps/webapps.js';
import '../../public/js/apps/vscode.js';
import '../../public/js/apps/bilibili.js';
import '../../public/js/apps/copilot.js';
import '../../public/js/apps/minesweeper.js';
import '../../public/js/apps/defender.js';
import '../../public/js/apps/camera.js';
import '../../public/js/apps/pythonEditor.js';
import '../../public/js/apps/notepadFonts.js';
import '../../public/js/apps/python.js';
import '../../public/js/apps/search.js';
import '../../public/js/apps/winver.js';
import '../../public/js/apps/wsa.js';
import '../../public/js/apps/word.js';
import '../../public/js/apps/windows12.js';

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
