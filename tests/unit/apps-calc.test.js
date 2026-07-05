import { describe, expect, it } from 'vitest';
import '../../public/js/core/registry.js';
import '../../public/js/apps/calc.js';

const calc = window.win12.apps.get('calc');

describe('apps/calc (extracted onto the kernel)', () => {
  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('calc')).toBe(true);
    expect(window.apps.calc).toBe(calc);
  });

  it('init() resets the calculator display to 0', () => {
    document.body.innerHTML = '<div id="calc-input">123+456</div>';
    calc.init();
    expect(document.getElementById('calc-input').innerHTML).toBe('0');
  });
});
