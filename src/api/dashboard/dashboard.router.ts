import express from 'express';
import { getDashboardSummary } from './dashboard.controller';

const dashboardRouter = express.Router();
dashboardRouter.get('/summary', (req, res) => {
  getDashboardSummary(req, res);
});
export default dashboardRouter;
