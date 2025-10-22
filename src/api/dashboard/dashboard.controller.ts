import { getDashboardSummaryService } from './dashboard.service';

import { Request, Response } from 'express';

export const getDashboardSummary = async (req: Request, res: Response) => {
  const { from, to } = req.query;
  const fromDate = from
    ? new Date(from as string)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const toDate = to ? new Date(to as string) : new Date();
  const summary = await getDashboardSummaryService(fromDate, toDate);
  res.json(summary);
};
