import { ResultType } from '@/types/global'
import request from '@/utils/request'

export const queryMenu = async (): Promise<ResultType<any>> => {
  return request('/api/menu', {
    method: 'GET'
  });
} 