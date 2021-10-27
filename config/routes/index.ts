import { lazy } from 'react';
import type { RouteType } from './type';

const routes: RouteType[] = [
  {
    path: '/login',
    meta: {
      title: '登录',
    },
    component: lazy(() => import('@/pages/Login')),
  },
  {
    path: '/',
    component: lazy(() => import('@/layouts/BasicLayout')),
    routes: [
      {
        path: '/home',
        component: lazy(() => import('@/pages/Home')),
      },
      {
        path: '/manager',
        component: lazy(() => import('@/layouts/BlankLayout')),
        routes: [
          {
            path: '/manager/menu',
            component: lazy(() => import('@/pages/SideMenu')),
          },
          {
            path: '/manager/userManager',
            component: lazy(()=>import('@/pages/Admin/userManager'))
          },
          {
            path: '/manager/roleManager',
            component: lazy(()=>import('@/pages/Admin/roleManager'))
          }
        ],
      },
    ],
  },
];

export default routes;
