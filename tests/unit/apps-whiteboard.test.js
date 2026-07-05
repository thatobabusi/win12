import { describe, expect, it, beforeEach } from 'vitest';
import '../../public/js/core/registry.js';
import '../../public/js/apps/whiteboard.js';

const wb = window.win12.apps.get('whiteboard');

beforeEach(() => {
  wb.ctx = {}; // stub 2D context — changeColor only sets properties on it
  wb.color = 'red';
});

describe('apps/whiteboard (extracted onto the kernel)', () => {
  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('whiteboard')).toBe(true);
    expect(window.apps.whiteboard).toBe(wb);
  });

  it('changeColor("eraser") switches to destination-out erasing', () => {
    wb.changeColor('eraser');
    expect(wb.color).toBe('eraser');
    expect(wb.ctx.strokeStyle).toBe('black');
    expect(wb.ctx.lineWidth).toBe(35);
    expect(wb.ctx.globalCompositeOperation).toBe('destination-out');
  });

  it('changeColor(color) switches to a source-over pen', () => {
    wb.changeColor('blue');
    expect(wb.color).toBe('blue');
    expect(wb.ctx.strokeStyle).toBe('blue');
    expect(wb.ctx.lineWidth).toBe(8);
    expect(wb.ctx.globalCompositeOperation).toBe('source-over');
  });
});
