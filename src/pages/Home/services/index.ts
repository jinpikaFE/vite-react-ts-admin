import { ResultType } from '@/types/global';
import request from '@/utils/request';
import { GlobalType } from '../type';

export const findAllUser = async (): Promise<ResultType<any>> => {
  return request('/api/users', {
    method: 'GET',
  });
};

export const findUvMaps = async (type: GlobalType): Promise<ResultType<any>> => {
  return request(`/api/uv/maps/${type}`, {
    method: 'GET',
  });
};

export const findUvAll = async (params: {
  type: GlobalType;
}): Promise<ResultType<any>> => {
  return request('/api/uv/statistics', {
    method: 'GET',
    params,
  });
};

export const findPvAll = async (params: {
  type: GlobalType;
}): Promise<ResultType<any>> => {
  return request('/api/pv/statistics', {
    method: 'GET',
    params,
  });
};
