import { ResultType } from '@/types/global';
import request from '@/utils/request';
import { FormUserType } from './type';

export const queryUser = async (params: any): Promise<ResultType<any>> => {
  return request('/api/users', {
    method: 'GET',
    params,
  });
};

export const queryUserOne = async (id: string): Promise<ResultType<any>> => {
  return request(`/api/users/${id}`, {
    method: 'GET',
  });
};

export const createUser = async (
  params: FormUserType,
): Promise<ResultType<any>> => {
  return request('/api/users', {
    method: 'POST',
    data: params,
  });
};

export const delUser = async (
  id: string,
  fileName: string,
): Promise<ResultType<any>> => {
  return request(`/api/users/${id}/${fileName}`, {
    method: 'DELETE',
  });
};

export const updateUser = async (
  id: string,
  params: FormUserType,
): Promise<ResultType<any>> => {
  return request(`/api/users/${id}`, {
    method: 'PATCH',
    data: params,
  });
};
