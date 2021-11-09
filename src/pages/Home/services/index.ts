import { ResultType } from '@/types/global';
import request from '@/utils/request';
import { GlobalType } from '../type';

export const findAllUser = async (): Promise<ResultType<any>> => {
  return request('/api/users', {
    method: 'GET',
  });
};

export const findUvMaps = async (
  type: GlobalType,
): Promise<ResultType<any>> => {
  return request(`/api/uv/maps/${type}`, {
    method: 'GET',
  });
};

export const findUvStatistics = async (params: {
  type: GlobalType;
}): Promise<ResultType<any>> => {
  return request('/api/uv/statistics', {
    method: 'GET',
    params,
  });
};

export const findPvStatistics = async (params: {
  type: GlobalType;
}): Promise<ResultType<any>> => {
  return request('/api/pv/statistics', {
    method: 'GET',
    params,
  });
};

export const findUvAll = async <T = any>(
  params: T,
): Promise<ResultType<any>> => {
  return request('/api/uv/all', {
    method: 'GET',
    params,
  });
};

export const findPvAll = async <T = any>(
  params: T,
): Promise<ResultType<any>> => {
  return request('/api/pv/all', {
    method: 'GET',
    params,
  });
};
