export type UvStatisticsType = {
  uvTotal: number;
  uvAverageTime: number;
};

export type PvStatisticsType = {
  pvTotal: number;
  pvThisYear: number;
  pvThisMonth: number;
  pvLastDay: number;
  pvPeak: number;
};

export type GlobalType = 'admin' | 'blog' | 'all';

export type FormMonitorType = {
  id: number;
  type: 'admin' | 'blog';
  uid: string;
  ip: string;
  address?: string;
  startTime: Date;
  endTime?: Date;
  durationVisit: number;
  pathname?: string;
};
