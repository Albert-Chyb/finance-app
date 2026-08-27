import { describe, expect, it } from 'vitest';
import { clamp } from './clamp.js';

describe('clamp', () => {
  it('clamps the number to the upper boundary', () => {
    expect(clamp(2, 0, 1)).toEqual(1);
  });

  it('clamps the number to the lower boundary', () => {
    expect(clamp(-1, 0, 1)).toEqual(0);
  });

  it('returns the value if it is within the range', () => {
    expect(clamp(1, 0, 2)).toEqual(1);
  });
});
