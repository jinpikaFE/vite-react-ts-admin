import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { toTree } from '../../utils/untils.ts';

afterEach(cleanup);

it('实现树级递归，生成树形菜单', () => {
  var data = [
    { id: 1, name: '用户管理', pid: 0 },
    { id: 2, name: '菜单申请', pid: 1 },
    { id: 3, name: '信息申请', pid: 1 },
    { id: 4, name: '模块记录', pid: 2 },
    { id: 5, name: '系统设置', pid: 0 },
    { id: 6, name: '权限管理', pid: 5 },
    { id: 7, name: '用户角色', pid: 6 },
    { id: 8, name: '菜单设置', pid: 6 },
  ];
  expect(toTree(data, 'id', 'pid', (item) => item)).toEqual([
    {
      id: 1,
      name: '用户管理',
      pid: 0,
      children: [
        {
          id: 2,
          name: '菜单申请',
          pid: 1,
          children: [{ id: 4, name: '模块记录', pid: 2 }],
        },
        { id: 3, name: '信息申请', pid: 1 },
      ],
    },
    {
      id: 5,
      name: '系统设置',
      pid: 0,
      children: [
        {
          id: 6,
          name: '权限管理',
          pid: 5,
          children: [
            { id: 7, name: '用户角色', pid: 6 },
            { id: 8, name: '菜单设置', pid: 6 },
          ],
        },
      ],
    },
  ]);
});
