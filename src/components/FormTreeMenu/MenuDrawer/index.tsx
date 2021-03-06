import { message, Radio, TreeSelect } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ProForm, {
  DrawerForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-form';
import { MenuDrawerProps, MenuFormType } from './type';
import { createMenu, updateMenu } from '@/services/FromTreeMenu';
import { queryMenu } from '@/services/global';
import { toTree } from '@/utils/untils';
import { SketchPicker } from 'react-color';
import styles from './index.module.less'

const MenuDrawer: React.FC<MenuDrawerProps> = (props) => {
  const { onCloseDrawer, visibleDrawer, refTable, cItem } = props;
  const [treeData, setTreeData] = useState<any[]>([]);
  const [background, setBackground] = useState<string>('#fff');
  const formRef = useRef<ProFormInstance | any>();
  useEffect(() => {
    if (visibleDrawer) {
      const getData = async () => {
        const res = await queryMenu();
        if (res) {
          let dataTemp = toTree(res.data, '_id', 'lastMenu', (item) => {
            item.title = item.name;
            item.value = item._id;
            if (item?.isLink) {
              item.disabled = true;
              return item;
            }
            return item;
          });
          if (cItem) {
            const reduceFilter = (data: any[], cId: string) => {
              data.forEach((item, index) => {
                if (item?.children) {
                  reduceFilter(item?.children, cId);
                }
                if (item?._id === cId) {
                  data.splice(index, 1);
                }
              });
              return data;
            };
            dataTemp = reduceFilter(dataTemp, cItem?._id);
          }
          setTreeData(dataTemp);
        }
      };
      getData();
    }
  }, [visibleDrawer, cItem]);

  useEffect(() => {
    setBackground('#fff');
    if (visibleDrawer && cItem) {
      setBackground(cItem?.color);
      formRef?.current?.resetFields();
      formRef?.current?.setFieldsValue(cItem);
    }
  }, [visibleDrawer, cItem]);

  return (
    <DrawerForm<MenuFormType>
    className={styles.drawerForm}
      {...{
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      }}
      title="????????????"
      layout="horizontal"
      visible={visibleDrawer}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: onCloseDrawer,
      }}
      onFinish={async (values: MenuFormType) => {
        if (cItem) {
          const res = await updateMenu(cItem?._id, {
            ...values,
            color: values?.color?.hex || values?.color,
          });
          if (res) {
            refTable?.reload();
            window.location.reload()
            message.success(res.message || '????????????');
            onCloseDrawer();
          }
        } else {
          const res = await createMenu({
            ...values,
            color: values?.color?.hex,
          });
          if (res) {
            refTable?.reload();
            window.location.reload()
            message.success(res.message || '????????????');
            onCloseDrawer();
          }
        }
      }}
      initialValues={{
        status: 1,
        isLink: 0,
      }}
      formRef={formRef}
    >
      <ProFormText
        width="md"
        name="name"
        label="????????????"
        tooltip="????????? 16 ???"
        placeholder="?????????????????????"
        rules={[
          { required: true, message: '?????????????????????!' },
          {
            validator: (rule, value, callback) => {
              if (value.length > 16) {
                callback('??????????????????????????? 16 ???');
              } else {
                callback();
              }
            },
          },
        ]}
      />
      <ProFormText
        width="md"
        name="path"
        label="????????????"
        placeholder="?????????????????????/path/paths???,???https://www.baidu.com/???"
        rules={[
          { required: true, message: '?????????????????????!' },
          {
            validator: (rule, value, callback) => {
              const match = new RegExp('^(/[a-zA-Z]+)+$', 'g');
              const urlMatch = new RegExp(
                '^https?://(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+.)+(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+)',
                'g',
              );
              if (!(match.test(value) || urlMatch.test(value))) {
                callback('????????????????????????');
              } else {
                callback();
              }
            },
          },
        ]}
      />
      <ProForm.Item label="????????????" name="lastMenu">
        <TreeSelect
          allowClear
          className='input-fix-md'
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="?????????"
        />
      </ProForm.Item>
      <ProFormText
        width="md"
        name="icon"
        label="??????"
        placeholder="??????????????????"
        rules={[
          { required: true, message: '??????????????????!' },
          {
            validator: (rule, value, callback) => {
              const match = new RegExp('^[^\u4e00-\u9fa5]+$', 'g');
              if (!match.test(value)) {
                callback('???????????????????????????');
              } else {
                callback();
              }
            },
          },
        ]}
      />
      <ProForm.Item
        name="color"
        label="??????????????????"
        rules={[{ required: true, message: '???????????????????????????!' }]}
      >
        <SketchPicker
          color={background}
          onChangeComplete={(color) => {
            setBackground(color.hex);
          }}
        />
      </ProForm.Item>
      <ProForm.Item name="status" label="??????">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={[
            {
              label: '??????',
              value: 1,
            },
            {
              label: '??????',
              value: 0,
            },
          ]}
        />
      </ProForm.Item>
      <ProForm.Item name="isLink" label="????????????">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={[
            {
              label: '???',
              value: 0,
            },
            {
              label: '???',
              value: 1,
            },
          ]}
        />
      </ProForm.Item>
    </DrawerForm>
  );
};

export default MenuDrawer;
