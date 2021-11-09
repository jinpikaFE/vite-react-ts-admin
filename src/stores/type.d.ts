export type MonitorUvType = {
  uid?: string;
  ip?: string;
  address?: string;
  startTime?: Date;
  endTime?: Date;
  durationVisit?: number;
  type: 'blog' | 'admin';
};
