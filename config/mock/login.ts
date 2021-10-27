import { ResultType } from '@/types/global';
import { IncomingMessage, ServerResponse } from 'http';

export default [
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }: any) => {
      const resObj: ResultType<any> = {
        code: -1,
        message: '登陆失败',
        data: {
          authority: 'admin',
          name: 'admin',
          avatar: 'http://assets.jinxinapp.cn/img/logo.png'
        },
      };
      resObj.data.loginType = body.loginType;

      if ( body.loginType === 'account') {
        resObj.data.userName = body.userName
        if (body.userName === 'admin' && body.password === 'admin') {
          resObj.code = 0
          resObj.message = '登录成功'
        } else {
          resObj.message = '登录失败, 用户名或者密码错误'
        }
      }
      if ( body.loginType === 'phone') {
        resObj.data.mobile = body.mobile
        if (body.captcha === '1234') {
          resObj.code = 0
          resObj.message = '登录成功'
        } else {
          resObj.message = '登录失败, 验证码错误'
        }
      }
      return resObj;
    },
  },
];
