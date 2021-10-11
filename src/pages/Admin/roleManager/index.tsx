import RightDrawer from '@/components/RightDrawer';
import { updateManyMenu } from '@/services/FromTreeMenu';
import { queryMenu } from '@/services/global';
import { toTree } from '@/utils/untils';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import ProTable, {
  ActionType,
  ProColumns,
} from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space, Tag, TreeSelect } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useFormatMessage } from 'react-intl-hooks';
import { createRole, delRole, queryRole, queryRoleOne, updateRole } from './services';
import { FormRoleType } from './type';

const RoleManager: React.FC = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [cItem, setCItem] = useState<FormRoleType>();
  const refTable = useRef<ActionType>();
  const [treeData, setTreeData] = useState<any[]>([]);

  const formatMessage = useFormatMessage();

  const columns: ProColumns[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '角色名',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      tip: '标题过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '权限',
      dataIndex: 'authority',
      search: false,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (text) => (
        <>
          {(text as any[])?.map((item) => (
            <Tag
              key={item?._id}
              color={item?.color}
              style={{ marginBottom: '5px' }}
            >
              {formatMessage({ id: `menu.${item?.name}` }) as string}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'registerTime',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      render: (text, record, _, action) => [
        <Button
          type="link"
          key="editable"
          onClick={() => {
            edit(record?._id);
          }}
        >
          编辑
        </Button>,
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
        </Popconfirm>,
      ],
    },
  ];

  useEffect(() => {
    if (visibleDrawer) {
      const getData = async () => {
        const res = await queryMenu();
        if (res) {
          let dataTemp = toTree(res.data, '_id', 'lastMenu', (item) => {
            item.title = formatMessage({ id: `menu.${item.name}` }) as string;
            item.value = item._id;
            if (item?.isLink) {
              item.disabled = true;
              return item;
            }
            return item;
          });
          setTreeData(dataTemp);
        }
      };
      getData();
    }
  }, [visibleDrawer, cItem]);

  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  const onCloseDrawer = () => {
    setVisibleDrawer(false);
  };

  const edit = async (id: string) => {
    const res = await queryRoleOne(id)
    setCItem(res?.data);
    showDrawer();
  };

  const del = async (id: string) => {
    const res = await delRole(id);
    if (res) {
      refTable?.current?.reload();
      message.success(res.message || '删除成功');
    }
  };

  const tProps = {
    treeData,
    treeCheckable: true,
    showCheckedStrategy: TreeSelect.SHOW_ALL,
    placeholder: '请选择',
    allowClear: true,
    style: { width: '328px' },
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
  };

  const renderFormItemDom = () => {
    return (
      <>
        <ProFormText
          width="md"
          name="name"
          label="角色名"
          tooltip="最长为 16 位"
          placeholder="请输入角色名"
          rules={[
            { required: true, message: '请输入角色名!' },
            {
              validator: (rule, value, callback) => {
                if (value.length > 16) {
                  callback('角色名过长，最长为 16 位');
                } else {
                  callback();
                }
              },
            },
          ]}
        />
        <ProForm.Item
          label="权限"
          name="authority"
          rules={[{ required: true, message: '请选择权限!' }]}
        >
          <TreeSelect {...tProps} />
        </ProForm.Item>
      </>
    );
  };

  const onFinish = async (values: FormRoleType) => {
    if (cItem) {
      const resRole = await updateRole(cItem?._id, values);
      if (resRole) {
        const res = await updateManyMenu(values);
        if (res) {
          refTable?.current?.reload();
          message.success(resRole.message || '更新成功');
          onCloseDrawer();
        }
      }
    } else {
      const resRole = await createRole(values);
      if (resRole) {
        const res = await updateManyMenu(values);
        if (res) {
          refTable?.current?.reload();
          message.success(resRole.message || '创建成功');
          onCloseDrawer();
        }
      }
    }
  };

  return (
    <>
      <ProTable
        bordered
        request={async () => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const menuData = await queryMenu();
          const msg = await queryRole();
          const dataTemp = msg.data?.map((item: any) => {
            item.authority = [];
            menuData.data?.forEach((c_item: any) => {
              if (c_item.authority.includes(item.name)) {
                item.authority.push(c_item);
              }
            });
            return item;
          });
          if (msg) {
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
        actionRef={refTable}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="_id"
        search={{
          labelWidth: 'auto',
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="高级表格"
        toolBarRender={() => [
          <Button key="out">导出数据</Button>,
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
      <RightDrawer
        onCloseDrawer={onCloseDrawer}
        visibleDrawer={visibleDrawer}
        cItem={cItem}
        title="新增角色"
        renderFormItemDom={renderFormItemDom}
        onFinish={onFinish as any}
      />
    </>
  );
};

export default RoleManager;
