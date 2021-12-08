export type FormBillType = {
  _id: string;
  date: Date;
  exRecords: IExRecord[];
  totalConsume: number;
};

export type BillChartPorps = {
  data: any[];
};

export interface IExRecord {
  type: string;
  value: number;
}
