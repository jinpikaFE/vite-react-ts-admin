import React, { useEffect } from 'react';
import { DrawerForm, ProFormInstance } from '@ant-design/pro-form';
import type { ProFormProps } from '@ant-design/pro-form';
import { RightDrawerProps } from './type';
import styles from './index.module.less';

const RightDrawer: React.FC<
  RightDrawerProps & ProFormProps & { ref: ProFormInstance | any }
> = React.forwardRef((props, formRef: ProFormInstance | any) => {
  const {
    onCloseDrawer,
    visibleDrawer,
    cItem,
    onFinish,
    title,
    renderFormItemDom,
    ...otherTableProps
  } = props;

  useEffect(() => {
    if (visibleDrawer && cItem) {
      formRef?.current?.resetFields();
      formRef?.current?.setFieldsValue(cItem);
    }
  }, [visibleDrawer, cItem]);

  useEffect(() => {
    if (!cItem) {
      formRef?.current?.resetFields();
    }
  }, [cItem]);

  return (
    <DrawerForm
      className={styles.drawerForm}
      {...{
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      }}
      title={title}
      layout="horizontal"
      visible={visibleDrawer}
      drawerProps={{
        forceRender: true,
        // destroyOnClose: true,
        onClose: onCloseDrawer,
      }}
      onFinish={onFinish}
      formRef={formRef}
      {...otherTableProps}
    >
      {renderFormItemDom()}
    </DrawerForm>
  );
});

export default RightDrawer;
