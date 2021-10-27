import { ResultType } from '@/types/global';
import request from '@/utils/request';

export const findAllUser = async (): Promise<ResultType<any>> => {
  return request('/api/users', {
    method: 'GET',
  });
};
