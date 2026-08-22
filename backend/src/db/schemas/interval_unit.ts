import { pgEnum } from 'drizzle-orm/pg-core';

export const intervalUnit = pgEnum('interval_unit', ['day', 'week', 'month', 'year']);