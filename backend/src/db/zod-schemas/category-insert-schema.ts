import { categories } from '../schemas/categories.js';
import { createInsertSchema } from 'drizzle-orm/zod';

export const categoryInsertSchema = createInsertSchema(categories, {
  name: (schema) => schema.trim().min(1).max(50),
});
