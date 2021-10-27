import RightDrawer from '@/components/RightDrawer';
import exportToExcel from '@/utils/exportToExcel';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Avatar, Button, message, Popconfirm, Row, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { queryRoleAlll } from '../roleManager/services';
import { createUser, delUser, queryUser, updateUser } from './services';
import { FormUserType } from './type';
import UserForm from './UserForm';

const UserManager: React.FC = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [cItem, setCItem] = useState<FormUserType>();
  const refTable = useRef<ActionType>();

  const [captcha, setCaptcha] = useState<string>('1111');

  const [datasSource, setDatasSource] = useState<any[]>([]);

  const [roleList, setRoleList] = useState<any[]>([]);

  useEffect(() => {
    const getRoleList = async () => {
      const res = await queryRoleAlll();
      if (res) {
        setRoleList(res.data);
      }
    };
    getRoleList();
  }, []);

  const columns: ProColumns[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
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
      render: (userName, record) => {
        return (
          <Row justify="start" align="middle" style={{ flexFlow: 'nowrap' }}>
            {record?.avatar && (
              <Avatar
                style={{ flex: '0 0 auto', marginRight: '5px' }}
                src={record.avatar?.[0]?.url}
              />
            )}
            {userName}
          </Row>
        );
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'role',
      renderFormItem: () => {
        return (
          <Select allowClear>
            {roleList?.map((item) => {
              return (
                <Select.Option value={item.name} key={item._id}>
                  {item?.name}
                </Select.Option>
              );
            })}
          </Select>
        );
      },
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
      valueType: 'dateTimeRange',
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
            edit(record);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="del"
          placement="topRight"
          title="确定要删除吗?"
          onConfirm={() => del(record?._id, record?.avatar?.[0]?.uid)}
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

  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  const onCloseDrawer = () => {
    setVisibleDrawer(false);
  };

  const edit = (item: FormUserType) => {
    setCItem(item);
    showDrawer();
  };

  const del = async (id: string, fileName: string) => {
    const res = await delUser(id, fileName);
    if (res) {
      refTable?.current?.reload();
      message.success(res.message || '删除成功');
    }
  };

  const renderFormItemDom = () => {
    return <UserForm setCaptcha={setCaptcha} cItem={cItem} />;
  };

  const onFinish = async (values: FormUserType) => {
    if (captcha === values?.captcha) {
      if (cItem) {
        const getAvatar = () => {
          if (values?.avatar?.file?.preview) {
            return values?.avatar?.file.preview;
          }
          return values?.avatar?.fileList?.length === 0 ? '' : values?.avatar;
        };
        const resRole = await updateUser(cItem?._id, {
          ...values,
          avatar: getAvatar(),
        });
        if (resRole) {
          refTable?.current?.reload();
          message.success(resRole.message || '更新成功');
          onCloseDrawer();
        }
      } else {
        const resRole = await createUser({
          ...values,
          avatar: values?.avatar?.file?.preview,
        });
        if (resRole) {
          refTable?.current?.reload();
          message.success(resRole.message || '创建成功');
          onCloseDrawer();
        }
      }
    } else {
      message.error('验证码错误');
    }
  };

  return (
    <>
      <ProTable<FormUserType>
        bordered
        request={async (params, sorter, filter) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const msg = await queryUser({ ...params, ...sorter, ...filter });
          if (msg) {
            return {
              data: msg.data,
              success: true,
              total: msg.total,
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
          pageSizeOptions: ['5', '10', '20', '30', '50', '100'],
        }}
        dateFormatter="string"
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button
            key="out"
            onClick={() => {
              exportToExcel(datasSource, '角色管理');
            }}
          >
            导出数据
          </Button>,
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
        title="新增用户"
        renderFormItemDom={renderFormItemDom}
        onFinish={onFinish as any}
      />
    </>
  );
};

export default UserManager;
