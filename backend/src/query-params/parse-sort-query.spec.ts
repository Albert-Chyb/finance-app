import { describe, expect, it } from 'vitest';
import { parseSortQuery } from './parse-sort-query.js';

describe('parseSortParamValue', () => {
  it('parses multiple sort expressions', () => {
    expect(parseSortQuery('lastName:asc,createdAt:desc')).toEqual([
      { field: 'lastName', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ]);
  });

  it('returns an empty array for an empty string', () => {
    expect(parseSortQuery('')).toEqual([]);
  });

  it('handles whitespace around commas', () => {
    expect(parseSortQuery('lastName:asc , createdAt:desc')).toEqual([
      { field: 'lastName', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ]);
  });

  it('handles whitespace around colons', () => {
    expect(parseSortQuery('lastName : asc,createdAt : desc')).toEqual([
      { field: 'lastName', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ]);
  });

  it('ignores empty expressions', () => {
    expect(parseSortQuery('lastName:asc,,createdAt:desc')).toEqual([
      { field: 'lastName', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ]);
  });

  it('uses the default direction when the colon is missing', () => {
    expect(parseSortQuery('lastName')).toEqual([
      { field: 'lastName', direction: 'asc' },
    ]);
  });

  it('uses the default direction when direction is missing', () => {
    expect(parseSortQuery('lastName:')).toEqual([
      { field: 'lastName', direction: 'asc' },
    ]);
  });

  it('uses the default direction for invalid directions', () => {
    expect(parseSortQuery('lastName:invalid')).toEqual([
      { field: 'lastName', direction: 'asc' },
    ]);
  });

  it('treats the direction as case insensitive', () => {
    expect(parseSortQuery('lastName:ASC,createdAt:DESC')).toEqual([
      { field: 'lastName', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ]);
  });

  it('ignores expressions without a field', () => {
    expect(parseSortQuery(':asc')).toEqual([]);
  });
});
