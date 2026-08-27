import { z } from 'zod';
import { clamp } from '../helpers/clamp.js';

export const DEFAULT_PAGE_INDEX = 1;

export const DEFAULT_PAGE_SIZE = 25;

export const MAX_PAGE_SIZE = 100;

const paginationSchema = z.object({
  pageIndex: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(DEFAULT_PAGE_INDEX)
    .catch(DEFAULT_PAGE_INDEX),
  pageSize: z.coerce
    .number()
    .int()
    .optional()
    .default(DEFAULT_PAGE_SIZE)
    .catch(DEFAULT_PAGE_SIZE)
    .transform((value) => clamp(value, 1, MAX_PAGE_SIZE)),
});

export type Pagination = z.infer<typeof paginationSchema>;

export function parsePaginationQuery(params: URLSearchParams): Pagination {
  const pageIndex = params.get('pageIndex') ?? undefined;
  const pageSize = params.get('pageSize') ?? undefined;
  return paginationSchema.parse({ pageIndex, pageSize });
}
