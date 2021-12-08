import RightDrawer from '@/components/RightDrawer';
import exportToExcel from '@/utils/exportToExcel';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Card, message, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { FormBillType } from './type';
import BillForm from './components/BillForm';
import { ProFormInstance } from '@ant-design/pro-form';
import { createBill, delBill, queryBill, updateBill } from './services';
import { CUSTOMOPTIONS } from './constants';
import moment from 'moment';
import BillChart from './components/BillChart';

const Bill: React.FC = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [cItem, setCItem] = useState<FormBillType>();
  const refTable = useRef<ActionType>();
  const formRef = useRef<ProFormInstance | any>();

  const [datasSource, setDatasSource] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const columns: ProColumns[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '日期',
      dataIndex: 'date',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '消费总额',
      dataIndex: 'totalConsume',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'registerTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '日期',
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
        <Popconfirm
          key="del"
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
    console.log(formRef);
  }, [formRef]);

  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  const onCloseDrawer = () => {
    setVisibleDrawer(false);
  };

  const edit = (item: FormBillType) => {
    setCItem(item);
    showDrawer();
  };

  const del = async (id: string) => {
    const res = await delBill(id);
    if (res) {
      refTable?.current?.reload();
      message.success(res.message || '删除成功');
    }
  };

  const renderFormItemDom = () => {
    return <BillForm formRef={formRef} />;
  };

  const onFinish = async (values: FormBillType) => {
    if (cItem) {
      const res = await updateBill(cItem?._id, {
        ...values,
        date: new Date(values?.date),
      });
      if (res) {
        refTable?.current?.reload();
        message.success(res?.message || '更新成功');
        onCloseDrawer();
      }
    } else {
      const res = await createBill({
        ...values,
        date: new Date(values?.date),
      });
      if (res) {
        refTable?.current?.reload();
        message.success(res.message || '创建成功');
        onCloseDrawer();
      }
    }
  };

  const expandedRowRender = (record: FormBillType) => {
    return (
      <ProTable
        columns={[
          {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: ((text: 'diet' | 'shop') => CUSTOMOPTIONS?.[text]) as (
              text: any,
            ) => any,
          },
          { title: '消费金额', dataIndex: 'value', key: 'value' },
        ]}
        headerTitle="消费记录"
        search={false}
        options={false}
        bordered
        dataSource={record?.exRecords}
        pagination={false}
      />
    );
  };

  return (
    <>
      <ProTable<FormBillType>
        scroll={{ x: true }}
        bordered
        request={async (params, sorter, filter) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const msg = await queryBill({ ...params, ...sorter, ...filter });
          if (msg) {
            const exData = await queryBill({
              ...params,
              ...sorter,
              ...filter,
              pageSize: null,
              current: null,
            });
            const newData: any[] = [];
            exData.data.forEach((item: { exRecords: any; date: any }) => {
              item.exRecords.forEach(
                (c_item: { type: 'diet' | 'shop'; value: number }) => {
                  newData.push({
                    type: CUSTOMOPTIONS?.[c_item.type],
                    value: c_item.value,
                    date: moment(item.date).format('YYYY-MM-DD'),
                  });
                },
              );
            });
            setChartData(exData?.data);
            setDatasSource(newData);
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
        expandable={{ expandedRowRender }}
        toolBarRender={() => [
          <Button
            key="out"
            onClick={() => {
              exportToExcel(datasSource, '账单管理');
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
      <Card style={{ marginTop: '20px' }}>
        <BillChart data={chartData} />
      </Card>
      <RightDrawer
        ref={formRef}
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

export default Bill;
