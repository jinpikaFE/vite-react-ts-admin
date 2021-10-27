import UploadAvatar from '@/components/UploadAvatar';
import { MailTwoTone } from '@ant-design/icons';
import ProForm, { ProFormCaptcha, ProFormText } from '@ant-design/pro-form';
import { useEventTarget } from 'ahooks';
import { Input, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { queryRoleAlll } from '../roleManager/services';
import { FormUserType } from './type';

const { Option } = Select;
const UserForm: React.FC<{
  setCaptcha: React.Dispatch<React.SetStateAction<string>>;
  cItem?: FormUserType;
}> = (props) => {
  const { setCaptcha, cItem } = props;
  const [value, { onChange, reset }] = useEventTarget({
    transformer: (val: string) => val.replace(/[^\d]/g, ''),
  });
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

  return (
    <>
      <ProFormText
        width="md"
        name="userName"
        label="用户名"
        tooltip="最长为 16 位"
        placeholder="请输入用户名"
        rules={[
          { required: true, message: '请输入用户名!' },
          {
            validator: (rule, value, callback) => {
              if (value.length > 16) {
                callback('用户名过长，最长为 16 位');
              } else {
                callback();
              }
            },
          },
        ]}
      />
      <ProFormText
        width="md"
        name="email"
        label="邮箱"
        placeholder="请输入邮箱"
        rules={[
          {
            type: 'email',
            message: '请输入正确的邮箱!',
          },
          {
            required: true,
            message: '请输入邮箱!',
          },
        ]}
      />
      <ProForm.Item
        label="手机号"
        name="phone"
        rules={[
          { required: true, message: '请输入手机号!' },
          {
            validator: (rule, value, callback) => {
              const match =
                /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/g;
              if (!match.test(value)) {
                callback('请输入正确的手机号');
              } else {
                callback();
              }
            },
          },
        ]}
      >
        <Input
          allowClear
          maxLength={11}
          style={{ width: '328px' }}
          value={value || cItem?.phone || ''}
          onChange={onChange}
        />
      </ProForm.Item>
      {!cItem && (
        <>
          <ProFormText.Password
            width="md"
            label="密码"
            name="password"
            extra="密码至少包含 数字和英文，长度6-20"
            validateFirst={true}
            rules={[
              { required: true, message: '请输入密码!' },
              {
                validator: (rule, value, callback) => {
                  const match = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/g;
                  if (!match.test(value)) {
                    callback('密码至少包含 数字和英文，长度6-20');
                  } else {
                    callback();
                  }
                },
              },
            ]}
          />
          <ProFormText.Password
            width="md"
            label="确认密码"
            name="confirmPassword"
            placeholder="请再次输入密码"
            rules={[
              { required: true, message: '请输入确认密码密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入密码不一致!'));
                },
              }),
            ]}
          />
        </>
      )}
      <ProForm.Item
        label="角色"
        name="role"
        rules={[{ required: true, message: '请选择角色!' }]}
      >
        <Select placeholder="请选择角色" style={{ width: 328 }} allowClear>
          {roleList?.map((item) => (
            <Option value={item?.name} key={item?._id}>
              {item?.name}
            </Option>
          ))}
        </Select>
      </ProForm.Item>
      <UploadAvatar avatar={cItem?.avatar} />
      <ProFormCaptcha
        fieldProps={{
          size: 'large',
          prefix: <MailTwoTone />,
        }}
        captchaProps={{
          size: 'large',
        }}
        label="验证码"
        // 手机号的 name，onGetCaptcha 会注入这个值
        phoneName="phone"
        name="captcha"
        rules={[
          {
            required: true,
            message: '请输入验证码',
          },
        ]}
        placeholder="请输入验证码"
        // 如果需要失败可以 throw 一个错误出来，onGetCaptcha 会自动停止
        // throw new Error("获取验证码错误")
        onGetCaptcha={async (phone) => {
          const random = parseInt((Math.random() * 10000).toString());
          setCaptcha(random.toString());
          message.success(`验证码为${random}`);
        }}
      />
    </>
  );
};

export default UserForm;
