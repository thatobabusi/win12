import { describe, expect, it, beforeEach } from 'vitest';
import '../../src/js/core/registry.js';
import '../../src/js/apps/imgviewer.js';

const img = window.win12.apps.get('imgviewer');

// Chainable no-op jQuery stub so the transform helper can run headless.
beforeEach(() => {
  window.$ = () => ({ css() { return this; }, attr() { return this; }, text() { return this; } });
  img._scale = 1;
  img._rotate = 0;
});

describe('apps/imgviewer (extracted onto the kernel)', () => {
  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('imgviewer')).toBe(true);
    expect(window.apps.imgviewer).toBe(img);
  });

  it('exposes the expected controller surface', () => {
    ['init', 'open', 'close', 'zoomIn', 'zoomOut', 'rotateRight', 'resetView'].forEach((m) => {
      expect(typeof img[m]).toBe('function');
    });
  });

  it('zoomIn scales up and clamps at 10x', () => {
    img.zoomIn();
    expect(img._scale).toBeCloseTo(1.25);
    img._scale = 9.5;
    img.zoomIn();
    expect(img._scale).toBe(10);
  });

  it('zoomOut scales down and clamps at 0.1x', () => {
    img.zoomOut();
    expect(img._scale).toBeCloseTo(0.8);
    img._scale = 0.11;
    img.zoomOut();
    expect(img._scale).toBe(0.1);
  });

  it('rotateRight steps 90deg and wraps at 360', () => {
    img.rotateRight();
    expect(img._rotate).toBe(90);
    img._rotate = 270;
    img.rotateRight();
    expect(img._rotate).toBe(0);
  });

  it('resetView restores scale and rotation', () => {
    img._scale = 4;
    img._rotate = 180;
    img.resetView();
    expect(img._scale).toBe(1);
    expect(img._rotate).toBe(0);
  });
});
