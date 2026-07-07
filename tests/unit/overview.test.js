import { describe, expect, it } from 'vitest';
import '../../src/js/modules/overview.js';

const { computeLayout, isActive } = window.win12.overview;

describe('modules/overview (Activities window picker)', () => {
  it('exposes its API on win12.overview and starts inactive', () => {
    expect(typeof computeLayout).toBe('function');
    expect(isActive()).toBe(false);
  });

  it('returns no cells for zero windows', () => {
    expect(computeLayout(0, 1000, 800)).toEqual([]);
  });

  it('lays a single window out centred with margins', () => {
    const [cell] = computeLayout(1, 1000, 800, 24);
    expect(cell.w).toBe(1000 - 48);
    expect(cell.h).toBe(800 - 48);
    expect(cell.x).toBe(24);
    expect(cell.y).toBe(24);
  });

  it('arranges n windows in a near-square grid', () => {
    // 5 windows -> 3 cols x 2 rows
    const cells = computeLayout(5, 1200, 800, 20);
    expect(cells).toHaveLength(5);
    const rows = new Set(cells.map((c) => c.y));
    expect(rows.size).toBe(2);
    const firstRow = cells.filter((c) => c.y === cells[0].y);
    expect(firstRow).toHaveLength(3);
  });

  it('centres a short last row', () => {
    const cells = computeLayout(3, 1200, 800, 20); // 2 cols x 2 rows, last row = 1
    const last = cells[2];
    const cellW = last.w;
    // the single last-row cell should be horizontally centred
    expect(last.x).toBeCloseTo((1200 - cellW) / 2, 5);
  });

  it('keeps every cell inside the area', () => {
    for (const n of [1, 2, 3, 4, 7, 9, 12]) {
      for (const cell of computeLayout(n, 1366, 700, 24)) {
        expect(cell.x).toBeGreaterThanOrEqual(0);
        expect(cell.y).toBeGreaterThanOrEqual(0);
        expect(cell.x + cell.w).toBeLessThanOrEqual(1366 + 0.001);
        expect(cell.y + cell.h).toBeLessThanOrEqual(700 + 0.001);
      }
    }
  });
});
