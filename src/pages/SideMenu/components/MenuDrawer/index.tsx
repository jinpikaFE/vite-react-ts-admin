import { Drawer } from 'antd';
import React from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { MenuDrawerProps } from './type';

const MenuDrawer: React.FC<MenuDrawerProps> = (props) => {
  const { onCloseDrawer, visibleDrawer } = props;

  return (
    <Drawer
      title="新建菜单"
      placement="right"
      onClose={onCloseDrawer}
      visible={visibleDrawer}
      width={720}
    >
      <ProForm
        {...{
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }}
        layout="horizontal"
      >
        <ProFormText
          width="md"
          name="name"
          label="菜单名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
        />
        <ProFormText
          width="md"
          name="company"
          label="我方公司名称"
          placeholder="请输入名称"
        />
        <ProFormText
          name={['contract', 'name']}
          width="md"
          label="合同名称"
          placeholder="请输入名称"
        />
      </ProForm>
    </Drawer>
  );
};

export default MenuDrawer;
