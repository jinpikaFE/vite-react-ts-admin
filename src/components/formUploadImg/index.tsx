import add from '@/assets/add2.png';
import { uploadFile } from '@/global/api';
import type { FormItemProps, UploadProps } from 'antd';
import { Modal, Upload, message, Form } from 'antd';
import React, { useState } from 'react';

type TFormUploadImg = {
  /** 图片不能超过的大小 默认512 */
  fileSize?: number;
  /** FormItem属性 */
  formItemProps?: FormItemProps;
  /** upload属性 */
  uploadProps?: UploadProps;
  /** 是否必填 */
  required?: boolean;
  /** 文件上传额外处理 */
  extraUploadFn?: (obj: any) => void;
};

const FormUploadImg: React.FC<TFormUploadImg> = (props) => {
  const { fileSize, formItemProps, uploadProps, required, extraUploadFn } =
    props;
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');

  /** 是否超出尺寸 */
  const [isOutSize, setIisOutSize] = useState<boolean>(false);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: any) => {
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    );
    setPreviewImage(file?.thumbUrl);
    setPreviewVisible(true);
  };

  const handleUpload = async (info: any) => {
    const { file } = info;
    if (file?.size / 1024 < (fileSize || 0)) {
      const formData = new FormData();
      formData.append('file', file);
      if (extraUploadFn) {
        extraUploadFn({ info, formData });
      } else {
        const res = await uploadFile(formData);
        if (res?.code === 200) {
          file.file_link = res?.data?.file_link;
          setIisOutSize(false);
          info.onSuccess();
        } else {
          info.onError('上传失败');
        }
      }
    } else {
      info.onError(
        `图片大小超出${
          (fileSize || 512) > 1024
            ? Math.fround((fileSize || 512) / 1024) + 'M'
            : fileSize + 'k'
        }`,
      );
      setIisOutSize(true);
      message.error(
        `图片大小超出${
          (fileSize || 512) > 1024
            ? Math.fround((fileSize || 512) / 1024) + 'M'
            : fileSize + 'k'
        }`,
      );
    }
  };

  /** 处理form.item upload问题 */
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const uploadButton = (
    <div>
      <img src={add} alt="" />
      <div style={{ marginTop: 8, color: '#00B864' }}>上传图片</div>
    </div>
  );
  return (
    <>
      <Form.Item
        required={required}
        label="项目图片"
        rules={[
          { required: required, message: '请上传' },
          () => ({
            validator(_, value) {
              if (isOutSize) {
                return Promise.reject(new Error(`图片超出${fileSize}k`));
              }
              if (value?.[0]?.error) {
                return Promise.reject(new Error(value?.[0]?.error));
              }
              return Promise.resolve();
            },
          }),
        ]}
        valuePropName="fileList"
        getValueFromEvent={normFile}
        name="image"
        style={{ width: '100%' }}
        {...formItemProps}
      >
        <Upload
          // action="http://192.168.212.115:8015/v1/upload/"
          // beforeUpload={() => false}
          customRequest={handleUpload}
          listType="picture-card"
          onPreview={handlePreview}
          {...uploadProps}
        >
          {uploadButton}
        </Upload>
      </Form.Item>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="头像" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

FormUploadImg.defaultProps = {
  fileSize: 512,
};

export default FormUploadImg;
