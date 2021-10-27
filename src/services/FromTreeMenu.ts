import { MenuFormType } from '@/components/FormTreeMenu/MenuDrawer/type';
import { ResultType } from '@/types/global';
import request from '@/utils/request';

export const createMenu = async (
  params: MenuFormType,
): Promise<ResultType<any>> => {
  return request('/api/menu', {
    method: 'POST',
    data: params,
  });
};

export const delMenu = async (
  id: string,
): Promise<ResultType<any>> => {
  return request(`/api/menu/${id}`, {
    method: 'DELETE'
  });
};

export const updateMenu = async (
  id: string, params: MenuFormType
): Promise<ResultType<any>> => {
  return request(`/api/menu/${id}`, {
    method: 'PATCH',
    data: params
  });
};

export const updateManyMenu = async ( params: {name: string;authority?: string[]}
): Promise<ResultType<any>> => {
  return request(`/api/menu/many`, {
    method: 'POST',
    data: params
  });
};
