import {
  ProFormDatePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { Input } from 'antd';
import type {
  FormListFieldData,
  FormListOperation,
} from 'antd/lib/form/FormList';
import React, { ReactNode, useEffect } from 'react';

const BillForm: React.FC<{
  formRef?: ProFormInstance | any;
}> = (props) => {
  const { formRef } = props;

  const handleChange = () => {
    let total = 0;
    for (
      let index = 0;
      index <
      formRef?.current?.getFieldsValue(['exRecords'])?.exRecords?.length;
      index++
    ) {
      const element = formRef?.current?.getFieldsValue(['exRecords'])
        ?.exRecords?.[index];
      total += element?.value ? +element?.value : 0;
    }
    formRef?.current?.setFieldsValue({ totalConsume: total });
  };

  return (
    <>
      <ProFormDatePicker width="md" name="date" label="日期" />
      <ProFormList
        name="exRecords"
        creatorButtonProps={{
          creatorButtonText: '添加一笔记录',
        }}
        label="消费记录"
        actionRender={(
          field: FormListFieldData,
          action: FormListOperation,
          defaultActionDom: ReactNode[],
        ) => {
          // 使用装饰者模式原有基础上添加handleChange
          return defaultActionDom.map((item: any) => {
            return {
              ...item,
              props: {
                ...item.props,
                children: {
                  ...item.props.children,
                  props: {
                    ...item.props.children.props,
                    onClick: () => {
                      item.props.children.props.onClick();
                      handleChange();
                    },
                  },
                },
              },
            };
          });
        }}
      >
        <Input.Group compact>
          <ProFormSelect
            initialValue="diet"
            options={[
              {
                value: 'diet',
                label: '饮食',
              },
              {
                value: 'shop',
                label: '购物',
              },
              {
                value: 'transport',
                label: '交通',
              },
            ]}
            width="xs"
            name="type"
          />
          <ProFormDigit
            onChange={handleChange}
            name="value"
            placeholder="请输入金额"
            rules={[
              {
                required: true,
                message: '请输入金额',
              },
            ]}
          />
        </Input.Group>
      </ProFormList>
      <ProFormText width="md" name="totalConsume" label="消费总额" disabled />
    </>
  );
};

export default BillForm;
