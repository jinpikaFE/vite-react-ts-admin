import { ResultType } from '@/types/global';
import request from '@/utils/request';

export const uploadFile = async (data: any): Promise<ResultType<any>> => {
  return request('/api/upload', {
    method: 'POST',
    data,
  });
};
