import { describe, expect, it } from 'vitest';
import { parseSortQuery, SORT_QUERY_PARAM_KEY } from './parse-sort-query.js';

describe('parseSortParamValue', () => {
  it('parses multiple sort expressions', () => {
    const searchParams = new URLSearchParams({
      [SORT_QUERY_PARAM_KEY]: 'lastName:asc,createdAt:desc',
    });

    expect(parseSortQuery(searchParams)).toEqual([
      { field: 'lastName', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ]);
  });

  it('returns an empty array when sort is missing', () => {
    expect(parseSortQuery(new URLSearchParams())).toEqual([]);
  });

  it('handles whitespace around commas', () => {
    const searchParams = new URLSearchParams({
      [SORT_QUERY_PARAM_KEY]: 'lastName:asc , createdAt:desc',
    });

    expect(parseSortQuery(searchParams)).toEqual([
      { field: 'lastName', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ]);
  });

  it('handles whitespace around colons', () => {
    const searchParams = new URLSearchParams({
      [SORT_QUERY_PARAM_KEY]: 'lastName : asc,createdAt : desc',
    });

    expect(parseSortQuery(searchParams)).toEqual([
      { field: 'lastName', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ]);
  });

  it('ignores empty expressions', () => {
    const searchParams = new URLSearchParams({
      [SORT_QUERY_PARAM_KEY]: 'lastName:asc,,createdAt:desc',
    });

    expect(parseSortQuery(searchParams)).toEqual([
      { field: 'lastName', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ]);
  });

  it('uses the default direction when the colon is missing', () => {
    const searchParams = new URLSearchParams({
      [SORT_QUERY_PARAM_KEY]: 'lastName',
    });

    expect(parseSortQuery(searchParams)).toEqual([
      { field: 'lastName', direction: 'asc' },
    ]);
  });

  it('uses the default direction when direction is missing', () => {
    const searchParams = new URLSearchParams({
      [SORT_QUERY_PARAM_KEY]: 'lastName:',
    });

    expect(parseSortQuery(searchParams)).toEqual([
      { field: 'lastName', direction: 'asc' },
    ]);
  });

  it('uses the default direction for invalid directions', () => {
    const searchParams = new URLSearchParams({
      [SORT_QUERY_PARAM_KEY]: 'lastName:invalid',
    });

    expect(parseSortQuery(searchParams)).toEqual([
      { field: 'lastName', direction: 'asc' },
    ]);
  });

  it('treats the direction as case insensitive', () => {
    const searchParams = new URLSearchParams({
      [SORT_QUERY_PARAM_KEY]: 'lastName:ASC,createdAt:DESC',
    });

    expect(parseSortQuery(searchParams)).toEqual([
      { field: 'lastName', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
    ]);
  });

  it('ignores expressions without a field', () => {
    const searchParams = new URLSearchParams({
      [SORT_QUERY_PARAM_KEY]: ':asc',
    });

    expect(parseSortQuery(searchParams)).toEqual([]);
  });
});
