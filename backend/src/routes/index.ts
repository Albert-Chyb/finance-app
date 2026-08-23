import categoriesRoutes from './categories.js';
import { Hono } from 'hono';

const routes = new Hono();

routes.route('/categories', categoriesRoutes);

export default routes;
