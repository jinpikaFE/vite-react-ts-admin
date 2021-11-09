import RightDrawer from '@/components/RightDrawer';
import { updateManyMenu } from '@/services/FromTreeMenu';
import { queryMenu } from '@/services/global';
import exportToExcel from '@/utils/exportToExcel';
import { toTree } from '@/utils/untils';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Select, Tag, TreeSelect } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useFormatMessage } from 'react-intl-hooks';
import {
  createRole,
  delRole,
  queryRole,
  queryRoleOne,
  updateRole,
} from './services';
import { FormRoleType } from './type';

const RoleManager: React.FC = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [cItem, setCItem] = useState<FormRoleType>();
  const refTable = useRef<ActionType>();

  const [treeData, setTreeData] = useState<any[]>([]);
  const [menusData, setMenusData] = useState<any[]>([]);

  const [datasSource, setDatasSource] = useState<any[]>([]);

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
      renderFormItem: () => {
        return (
          <Select allowClear>
            {menusData?.map((item) => {
              return (
                <Select.Option value={item._id} key={item._id}>
                  {formatMessage({ id: `menu.${item?.name}` }) as string}
                </Select.Option>
              );
            })}
          </Select>
        );
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
            edit(record?._id);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="del"
          placement="topRight"
          title="确定要删除吗?"
          onConfirm={() => del(record?._id, record?.name)}
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
    const getTableData = async () => {
      const res = await queryMenu();
      setMenusData(res?.data);
    };
    getTableData();
  }, []);

  useEffect(() => {
    if (visibleDrawer) {
      const getData = async () => {
        if (menusData) {
          const dataTemp = toTree(menusData, '_id', 'lastMenu', (item) => {
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
    const res = await queryRoleOne(id);
    setCItem(res?.data);
    showDrawer();
  };

  const del = async (id: string, name: string) => {
    const res = await delRole(id, name);
    if (res) {
      const updateData = await updateManyMenu({ name });
      if (updateData) {
        refTable?.current?.reload();
        message.success(res.message || '删除成功');
      }
    }
  };

  const tProps = {
    treeData,
    treeDefaultExpandAll: true,
    treeCheckable: true,
    treeCheckStrictly: true,
    showCheckedStrategy: TreeSelect.SHOW_ALL,
    placeholder: '请选择',
    allowClear: true,
    className: 'input-fix-md',
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
    const newAuthority = values?.authority?.map((item: any) => item.value);
    if (cItem) {
      const resRole = await updateRole(cItem?._id, {
        ...values,
        authority: newAuthority,
      });
      if (resRole) {
        const res = await updateManyMenu({
          ...values,
          authority: newAuthority,
        });
        if (res) {
          refTable?.current?.reload();
          message.success(resRole.message || '更新成功');
          onCloseDrawer();
        }
      }
    } else {
      const resRole = await createRole({ ...values, authority: newAuthority });
      if (resRole) {
        const res = await updateManyMenu({
          ...values,
          authority: newAuthority,
        });
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
      <ProTable<FormRoleType>
        scroll={{ x: true }}
        bordered
        request={async (params, sorter, filter) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const res = await queryMenu();
          const msg = await queryRole({ ...params, ...sorter, ...filter });
          const dataTemp = msg.data?.map((item: any) => {
            item.authority = [];
            res?.data?.forEach((c_item: any) => {
              if (c_item.authority.includes(item.name)) {
                item.authority.push(c_item);
              }
            });
            return item;
          });
          const midDataTemp = JSON.parse(JSON.stringify(dataTemp));
          if (msg) {
            const execlData = midDataTemp.map(
              (item: {
                authority: any[];
                name?: string;
                registerTime?: any;
              }) => {
                const tempArr: string[] = [];
                item?.authority?.map((c_item) => {
                  tempArr.push(
                    formatMessage({ id: `menu.${c_item.name}` }) as string,
                  );
                });
                item.authority = tempArr;
                const { name, authority, registerTime } = item;
                return {
                  name,
                  authority,
                  registerTime: new Date(registerTime).toLocaleString(),
                };
              },
            );
            setDatasSource(execlData);
            return {
              data: dataTemp,
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
        headerTitle="角色列表"
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
        title="新增角色"
        renderFormItemDom={renderFormItemDom}
        onFinish={onFinish as any}
      />
    </>
  );
};

export default RoleManager;
