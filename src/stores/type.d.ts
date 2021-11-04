export type MonitorUvType = {
  uid?: string;
  ip?: string;
  address?: string;
  startTime?: Date;
  endTime?: Date;
  durationVisit?: Number;
  type: 'blog' | 'admin';
}