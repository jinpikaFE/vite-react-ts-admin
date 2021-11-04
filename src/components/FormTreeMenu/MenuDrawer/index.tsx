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
      title="新建菜单"
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
            message.success(res.message || '更新成功');
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
            message.success(res.message || '创建成功');
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
        label="菜单名称"
        tooltip="最长为 16 位"
        placeholder="请输入菜单名称"
        rules={[
          { required: true, message: '请输入菜单名称!' },
          {
            validator: (rule, value, callback) => {
              if (value.length > 16) {
                callback('菜单名过长，最长为 16 位');
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
        label="路由路径"
        placeholder="路由路径，例‘/path/paths’,‘https://www.baidu.com/’"
        rules={[
          { required: true, message: '请输入路由路径!' },
          {
            validator: (rule, value, callback) => {
              const match = new RegExp('^(/[a-zA-Z]+)+$', 'g');
              const urlMatch = new RegExp(
                '^https?://(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+.)+(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+)',
                'g',
              );
              if (!(match.test(value) || urlMatch.test(value))) {
                callback('请输入正确的路由');
              } else {
                callback();
              }
            },
          },
        ]}
      />
      <ProForm.Item label="上级菜单" name="lastMenu">
        <TreeSelect
          allowClear
          className='input-fix-md'
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="请选择"
        />
      </ProForm.Item>
      <ProFormText
        width="md"
        name="icon"
        label="图标"
        placeholder="请输入图标名"
        rules={[
          { required: true, message: '请输入图标名!' },
          {
            validator: (rule, value, callback) => {
              const match = new RegExp('^[^\u4e00-\u9fa5]+$', 'g');
              if (!match.test(value)) {
                callback('请输入正确的图标名');
              } else {
                callback();
              }
            },
          },
        ]}
      />
      <ProForm.Item
        name="color"
        label="菜单标签颜色"
        rules={[{ required: true, message: '请选择菜单标签颜色!' }]}
      >
        <SketchPicker
          color={background}
          onChangeComplete={(color) => {
            setBackground(color.hex);
          }}
        />
      </ProForm.Item>
      <ProForm.Item name="status" label="状态">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={[
            {
              label: '启用',
              value: 1,
            },
            {
              label: '禁用',
              value: 0,
            },
          ]}
        />
      </ProForm.Item>
      <ProForm.Item name="isLink" label="是否外链">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={[
            {
              label: '否',
              value: 0,
            },
            {
              label: '是',
              value: 1,
            },
          ]}
        />
      </ProForm.Item>
    </DrawerForm>
  );
};

export default MenuDrawer;
