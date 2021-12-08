import { ResultType } from '@/types/global';
import request from '@/utils/request';
import { FormBillType } from './type';

export const queryBill = async (params: any): Promise<ResultType<any>> => {
  return request('/api/bill', {
    method: 'GET',
    params,
  });
};

export const queryBillOne = async (id: string): Promise<ResultType<any>> => {
  return request(`/api/bill/${id}`, {
    method: 'GET',
  });
};

export const createBill = async (
  params: FormBillType,
): Promise<ResultType<any>> => {
  return request('/api/bill', {
    method: 'POST',
    data: params,
  });
};

export const delBill = async (id: string): Promise<ResultType<any>> => {
  return request(`/api/bill/${id}`, {
    method: 'DELETE',
  });
};

export const updateBill = async (
  id: string,
  params: FormBillType,
): Promise<ResultType<any>> => {
  return request(`/api/bill/${id}`, {
    method: 'PATCH',
    data: params,
  });
};
