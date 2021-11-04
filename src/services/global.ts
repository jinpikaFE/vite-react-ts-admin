import { MonitorUvType } from '@/stores/type';
import { ResultType } from '@/types/global'
import request from '@/utils/request'

export const queryMenu = async (): Promise<ResultType<any>> => {
  return request('/api/menu', {
    method: 'GET'
  });
}

export const creatPv = async (params: MonitorUvType & { pathname?: string }): Promise<ResultType<any>> => {
  return request('/api/pv', {
    method: 'POST',
    data: params
  });
}

export const creatUv = async (params: MonitorUvType): Promise<ResultType<any>> => {
  return request('/api/uv', {
    method: 'POST',
    data: params
  });
}

export const queryPvAll = async (): Promise<ResultType<any>> => {
  return request('/api/pv/all', {
    method: 'GET'
  });
}

export const queryUvAll = async (): Promise<ResultType<any>> => {
  return request('/api/uv/all', {
    method: 'GET'
  });
}