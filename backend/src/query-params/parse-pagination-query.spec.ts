import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  parsePaginationQuery,
} from './parse-pagination-query.js';

describe('parsePaginationQuery', () => {
  it('parses pagination query params', () => {
    const result = parsePaginationQuery(
      new URLSearchParams('pageSize=25&pageIndex=2'),
    );

    expect(result).toEqual({
      pageSize: 25,
      pageIndex: 2,
    });
  });

  it('uses the default page index when pageIndex is missing', () => {
    const result = parsePaginationQuery(new URLSearchParams('pageSize=25'));

    expect(result).toEqual({
      pageSize: 25,
      pageIndex: DEFAULT_PAGE_INDEX,
    });
  });

  it('uses the default page size when pageSize is missing', () => {
    const result = parsePaginationQuery(new URLSearchParams('pageIndex=1'));

    expect(result).toEqual({
      pageSize: DEFAULT_PAGE_SIZE,
      pageIndex: 1,
    });
  });

  it('clamps the page size to the maximum page size', () => {
    const result = parsePaginationQuery(
      new URLSearchParams(`pageSize=${MAX_PAGE_SIZE + 1}&pageIndex=1`),
    );

    expect(result).toEqual({
      pageSize: 100,
      pageIndex: 1,
    });
  });

  it('clamps the page size to the minimum page size of 1', () => {
    const result = parsePaginationQuery(
      new URLSearchParams(`pageSize=${0}&pageIndex=1`),
    );

    expect(result).toEqual({
      pageSize: 1,
      pageIndex: 1,
    });
  });
});
