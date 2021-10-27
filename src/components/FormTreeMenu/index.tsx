import { delMenu } from '@/services/FromTreeMenu';
import { queryMenu } from '@/services/global';
import { IconFont } from '@/types/constants';
import { toTree } from '@/utils/untils';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import MenuDrawer from './MenuDrawer';
import { MenuFormType } from './MenuDrawer/type';

const FormTreeMenu: React.FC = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [cItem, setCItem] = useState<MenuFormType & { _id: string }>();
  const refTable = useRef<ActionType>();

  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  const onCloseDrawer = () => {
    setVisibleDrawer(false);
  };

  const edit = (record: any) => {
    setCItem(record);
    showDrawer();
  };

  const del = async (id: string) => {
    const res = await delMenu(id);
    if (res) {
      refTable?.current?.reload();
      message.success(res.message || '删除成功');
    }
  };

  const columns: ProColumns[] = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      copyable: true,
      // ellipsis: true,
    },
    {
      title: '图标',
      width: 60,
      align: 'center',
      dataIndex: 'icon',
      render: (text) => <IconFont type={text as string} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        0: {
          text: '停用',
          status: 'Error',
        },
        1: {
          text: '启用',
          status: 'Success',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'registerTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 50,
      render: (text, record) => [
        <Button
          type="link"
          key="editable"
          onClick={() => {
            edit(record);
          }}
        >
          编辑
        </Button>,
        <span key='del'>
          {!record?.children && (
            <Popconfirm
              placement="topRight"
              title="确定要删除吗?"
              onConfirm={() => del(record?._id)}
              okText="确定"
              okType="danger"
              cancelText="取消"
            >
              <Button type="link" danger key="delete">
                删除
              </Button>
            </Popconfirm>
          )}
        </span>,
      ],
    },
  ];

  return (
    <>
      <ProTable
        bordered
        actionRef={refTable}
        // params={params}
        request={async () => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const msg = await queryMenu();
          if (msg) {
            const dataTemp = toTree(
              msg.data,
              '_id',
              'lastMenu',
              (item) => item,
            );
            return {
              data: dataTemp,
              success: true,
            };
          }
          return {
            data: undefined,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: false,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: 0,
          };
        }}
        columns={columns}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="_id"
        search={false}
        pagination={false}
        dateFormatter="string"
        headerTitle="菜单列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              showDrawer();
              setCItem(undefined);
            }}
          >
            新建
          </Button>,
        ]}
      />
      <MenuDrawer
        onCloseDrawer={onCloseDrawer}
        visibleDrawer={visibleDrawer}
        refTable={refTable?.current}
        cItem={cItem}
      />
    </>
  );
};

export default FormTreeMenu;
