import { makeAutoObservable } from 'mobx';
import type { MonitorUvType } from './type';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

class Monitor {
  uvData: MonitorUvType = { type: 'admin' };
  pvData: MonitorUvType & { pathname?: string } = { type: 'admin' };
  pathStartTime: Date = new Date();
  constructor() {
    makeAutoObservable(this);
  }

  setUvData = (val: Omit<MonitorUvType, 'type'>) => {
    this.uvData = { ...this.uvData, ...val };
  };

  setPvData = (val: Omit<MonitorUvType, 'type'> & { pathname?: string }) => {
    this.pvData = { ...this.pvData, ...val };
  };

  setPathStartTime = (val: Date) => {
    this.pathStartTime = val;
  };
}
export const localeMonitor = new Monitor();
