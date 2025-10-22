import { getDashboardSummaryRepo } from './dashboard.repository';

export const getDashboardSummaryService = async (from: Date, to: Date) => {
  return await getDashboardSummaryRepo(from, to);
};
