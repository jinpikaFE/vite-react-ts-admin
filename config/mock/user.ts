import { ResultType } from '@/types/global';

export default [
  {
    url: '/api/users',
    method: 'get',
    response: ({ body }: any) => {
      const resObj: ResultType<any> = {
        code: 0,
        message: '查询成功',
        data: [
          {
            _id: '61839f6aa0b7f2fce7d3b359',
            userName: 'user',
            email: '4141@qq.com',
            phone: '15712421423',
            role: 'test',
            avatar:
              'https://jinpika-1308276765.cos.ap-shanghai.myqcloud.com/file%2F2022-07-04/bluebk.jpg.png',
            password: 'RBjsYi5YeIHo6txm2CL1pg==',
            salt: 'IjTw',
            registerTime: { $date: '2021-11-04T08:52:58.035Z' },
          },
        ],
      };
      return resObj;
    },
  },
];
