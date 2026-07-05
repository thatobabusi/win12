import { describe, expect, it } from 'vitest';
import '../../src/js/core/registry.js';
import '../../src/js/apps/about.js';

const about = window.win12.apps.get('about');

describe('apps/about (extracted onto the kernel)', () => {
  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('about')).toBe(true);
    expect(window.apps.about).toBe(about);
  });

  it('exposes the expected controller surface', () => {
    ['init', 'page', 'get', 'get_star', 'get_releases', 'repo', 'escape_html']
      .forEach((m) => expect(typeof about[m]).toBe('function'));
  });

  it('escape_html neutralises markup (pure helper still works after the move)', () => {
    expect(about.escape_html('<script>&"\'')).toBe('&lt;script&gt;&amp;&quot;&#39;');
  });
});
