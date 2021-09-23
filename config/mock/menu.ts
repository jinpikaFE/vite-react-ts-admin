import { ResultType } from '@/types/global';

export default [
  {
    url: '/api/menu',
    method: 'get',
    response: ({ body }: any) => {
      const resObj: ResultType = {
        code: 0,
        message: '菜单获取成功',
        data: {
          menuData: [
            {
              path: '/home',
              name: 'welcome',
              component: './Welcome',
              icon: 'icon-home',
              breadcrumbName: 'admin',
            },
            {
              path: '/admin',
              name: 'admin',
              access: 'canAdmin',
              component: './Admin',
              icon: 'icon-manage',
              routes: [
                {
                  path: '/admin/test',
                  name: 'sub-page',
                  component: './Welcome',
                  icon: 'icon-manage-order',
                },
                {
                  path: '/admin/sub-page2',
                  name: '二级页面',
                  component: './Welcome',
                },
                {
                  path: '/admin/sub-page3',
                  name: '三级页面',
                  component: './Welcome',
                },
              ],
            },
            {
              name: '列表页',
              path: '/list',
              component: './ListTableList',
              icon: 'icon-list',
              routes: [
                {
                  path: '/list/sub-page',
                  name: '一级列表页面',
                  routes: [
                    {
                      path: 'sub-sub-page1',
                      name: '一一级列表页面',
                      component: './Welcome',
                    },
                    {
                      path: 'sub-sub-page2',
                      name: '一二级列表页面',
                      component: './Welcome',
                    },
                    {
                      path: 'sub-sub-page3',
                      name: '一三级列表页面',
                      component: './Welcome',
                    },
                  ],
                },
                {
                  path: '/list/sub-page2',
                  name: '二级列表页面',
                  component: './Welcome',
                },
                {
                  path: '/list/sub-page3',
                  name: '三级列表页面',
                  component: './Welcome',
                },
              ],
            },
            {
              path: 'https://ant.design',
              name: 'Ant Design 官网外链',
              icon: 'icon-detail',
            },
          ],
        },
      };

      return resObj;
    },
  },
];
