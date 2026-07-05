import { describe, expect, it } from 'vitest';
import '../../src/js/core/registry.js';
import '../../src/js/apps/pdfviewer.js';

// The extraction is correct if the app is reachable through the kernel exactly
// as the legacy `apps` global expects (same object, right shape).
describe('apps/pdfviewer (extracted onto the kernel)', () => {
  it('registers itself with the kernel', () => {
    expect(window.win12.apps.has('pdfviewer')).toBe(true);
  });

  it('exposes the expected controller surface', () => {
    const pdf = window.win12.apps.get('pdfviewer');
    expect(typeof pdf.init).toBe('function');
    expect(typeof pdf.open).toBe('function');
    expect(typeof pdf.close).toBe('function');
    expect(pdf._blobUrl).toBe(null);
  });

  it('is the same object legacy code sees on window.apps', () => {
    expect(window.apps.pdfviewer).toBe(window.win12.apps.get('pdfviewer'));
  });
});
