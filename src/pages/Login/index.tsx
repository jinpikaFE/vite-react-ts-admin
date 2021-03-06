import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import { Observer } from 'mobx-react';
import QueueAnim from 'rc-queue-anim';
import {
  LoginForm,
  ProFormText,
  ProFormCaptcha,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import {
  UserOutlined,
  MobileOutlined,
  LockOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { message, Tabs, Space, Button, Card } from 'antd';
import ParticlesBg from 'particles-bg';
import { WaterMark } from '@ant-design/pro-layout';
import QRCode from 'qrcode.react';
import styles from './index.module.less';
import { postLogin } from './services';
import { useHistory } from 'react-router-dom';
import { setAuthority } from '@/utils/authority';
import { localeLogin } from '@/stores/login';
import { useUnmount } from 'ahooks';

type LoginType = 'phone' | 'account' | 'qrcode';

const iconStyles: CSSProperties = {
  marginLeft: '16px',
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '24px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const history = useHistory();

  const config = {
    num: [4, 7],
    rps: 0.1,
    radius: [5, 40],
    life: [1.5, 3],
    v: [2, 3],
    tha: [-40, 40],
    // body: "./img/icon.png", // Whether to render pictures
    // rotate: [0, 20],
    alpha: [0.6, 0],
    scale: [1, 0.1],
    position: 'all', // all or center or {x:1,y:1,width:100,height:100}
    color: ['random', '#ff0000'],
    cross: 'dead', // cross or bround
    random: 15, // or null,
    g: 5, // gravity
    // f: [2, -1], // force
    onParticleUpdate: (ctx: any, particle: any) => {
      ctx.beginPath();
      ctx.rect(
        particle.p.x,
        particle.p.y,
        particle.radius * 2,
        particle.radius * 2,
      );
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.closePath();
    },
  };

  const onFinish = async (val: any) => {
    setBtnLoading(true);
    postLogin({ ...val, loginType })
      .then((res) => {
        setBtnLoading(false);
        setAuthority(res.data?.role)
        localStorage.token = res.data?.token
        localeLogin.saveCurrentUser(res?.data)
        message.success(res.message || '????????????');
        history.push('/home')
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  return (
    <Observer>
      {() => (
        <div
          style={{ height: '100vh', background: 'snow' }}
          className={styles.login}
        >
          <WaterMark
            content="?????????"
            fontColor="gold"
            fontSize={18}
            gapX={100}
            gapY={100}
            style={{ height: '100%' }}
          >
            <LoginForm
              logo="http://assets.jinxinapp.cn/img/logo.png"
              title="Jin Pi Ka"
              subTitle="?????????vite-react????????????"
              onFinish={onFinish}
              submitter={{
                // ???????????????????????????
                render: (props) => {
                  return [
                    loginType !== 'qrcode' && (
                      <Button
                        type="primary"
                        size="large"
                        key="submit"
                        style={{ width: '100%' }}
                        loading={btnLoading}
                        onClick={() => props.form?.submit?.()}
                      >
                        ??????
                      </Button>
                    ),
                  ];
                },
              }}
              actions={
                <Space>
                  ??????????????????
                  <AlipayCircleOutlined
                    style={iconStyles}
                  ></AlipayCircleOutlined>
                  <TaobaoCircleOutlined
                    style={iconStyles}
                  ></TaobaoCircleOutlined>
                  <WeiboCircleOutlined style={iconStyles}></WeiboCircleOutlined>
                </Space>
              }
            >
              <QueueAnim delay={300}>
                <div key="tab">
                  <Tabs
                    activeKey={loginType}
                    onChange={(activeKey) => {
                      setLoginType(activeKey as LoginType);
                      setBtnLoading(false);
                    }}
                  >
                    <Tabs.TabPane key={'phone'} tab={'???????????????'} />
                    <Tabs.TabPane key={'account'} tab={'??????????????????'} />
                    <Tabs.TabPane key={'qrcode'} tab={'???????????????'} />
                  </Tabs>
                </div>
                {loginType === 'account' && (
                  <>
                    <ProFormText
                      name="userName"
                      fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'?????????: user'}
                      rules={[
                        {
                          required: true,
                          message: '??????????????????!',
                        },
                      ]}
                    />
                    <ProFormText.Password
                      name="password"
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'??????: q123456'}
                      rules={[
                        {
                          required: true,
                          message: '??????????????????',
                        },
                      ]}
                    />
                  </>
                )}
                {loginType === 'phone' && (
                  <>
                    <ProFormText
                      fieldProps={{
                        size: 'large',
                        prefix: <MobileOutlined className={'prefixIcon'} />,
                      }}
                      name="mobile"
                      placeholder={'?????????'}
                      rules={[
                        {
                          required: true,
                          message: '?????????????????????',
                        },
                        {
                          pattern: /^1\d{10}$/,
                          message: '????????????????????????',
                        },
                      ]}
                    />
                    <ProFormCaptcha
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      captchaProps={{
                        size: 'large',
                      }}
                      placeholder={'??????????????????'}
                      captchaTextRender={(timing, count) => {
                        if (timing) {
                          return `${count} ${'???????????????'}`;
                        }
                        return '???????????????';
                      }}
                      name="captcha"
                      rules={[
                        {
                          required: true,
                          message: '?????????????????????',
                        },
                      ]}
                      onGetCaptcha={async () => {
                        message.success('???????????????????????????????????????1234');
                      }}
                    />
                  </>
                )}
                {loginType === 'qrcode' && (
                  <>
                    <Card>
                      <QRCode
                        style={{ width: '100%', height: '100%' }}
                        level="M"
                        value="https://gitee.com/jinxin0517/vite-react-ts-admin"
                      />
                    </Card>
                  </>
                )}
                <div
                  key="loginBtn"
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <ProFormCheckbox noStyle name="autoLogin">
                    ????????????
                  </ProFormCheckbox>
                  <a
                    style={{
                      float: 'right',
                    }}
                  >
                    ????????????
                  </a>
                </div>
              </QueueAnim>
            </LoginForm>
          </WaterMark>
          <ParticlesBg
            type="custom"
            config={config}
            bg={
              {
                zIndex: 0,
                position: 'absolute',
                top: '0px',
                left: '0px',
                pointerEvents: 'none',
              } as any
            }
          />
        </div>
      )}
    </Observer>
  );
};

export default Login;
