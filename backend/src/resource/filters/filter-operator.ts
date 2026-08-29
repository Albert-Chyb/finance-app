import { z } from 'zod';

export const filterOperatorSchema = z.enum([
  'text-contains',
  'array-contains',
  'eq',
]);

export type FilterOperator = z.infer<typeof filterOperatorSchema>;
