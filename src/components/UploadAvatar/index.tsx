import { getBase64 } from '@/utils/untils';
import { PlusOutlined } from '@ant-design/icons';
import ProForm from '@ant-design/pro-form';
import { Modal, Upload } from 'antd';
import React, { useState } from 'react';

const UploadAvatar: React.FC = () => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const [fileList, setFileList] = useState<any[]>([]);
  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: any) => {
    console.log(1);

    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    );
    setPreviewVisible(true);
  };

  const handleChangeFile = async (val: any) => {
    console.log(val);

    setFileList(val?.fileList);
    const { file } = val;
    if (val?.fileList?.length > 0) {
      file.preview = await getBase64(val?.fileList?.[0].originFileObj);
      setPreviewImage(file.url || file.preview);
    } else {
      setPreviewImage('');
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <ProForm.Item label="头像" name="avatar" hasFeedback>
        <Upload
          fileList={fileList}
          beforeUpload={() => false}
          maxCount={1}
          listType="picture-card"
          onPreview={handlePreview}
          onChange={handleChangeFile}
        >
          {!previewImage && uploadButton}
        </Upload>
      </ProForm.Item>
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

export default UploadAvatar;
