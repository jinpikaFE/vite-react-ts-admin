import React, { Suspense, useEffect, useState } from 'react';
import {
  DefaultFooter,
  MenuDataItem,
  PageContainer,
  ProSettings,
  SettingDrawer,
} from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import { renderRoutes } from 'react-router-config';
import '@ant-design/pro-layout/dist/layout.css';
import { GithubOutlined } from '@ant-design/icons';
import { queryMenu } from '@/services/global';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Button, Input, Spin } from 'antd';
import { useFormatMessage } from 'react-intl-hooks';
import RightContent from '@/components/GlobalHeader/RightContent';
import proSettings from '@config/defaultSettings';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter, toTree } from '@/utils/untils';
import NotFound from '@/components/NotFound';
import loaclRoutes from '@config/routes';
import { staticMenu } from './staticMenu';
import type { RouteConfig } from 'react-router-config';
import Loading from '@/components/Loading';

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} Produced by JinPinKa`}
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://gitee.com/jinxin0517/vite-react-ts-admin',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

// 路由菜单，http菜单
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const footerRender = (props: any) => {
  return (
    <a
      style={{
        lineHeight: '48rpx',
        display: 'flex',
        height: 48,
        color: 'rgba(255, 255, 255, 0.65)',
        alignItems: 'center',
      }}
      href="https://preview.pro.ant.design/dashboard/analysis"
      target="_blank"
      rel="noreferrer"
    >
      <img
        alt="pro-logo"
        src="https://procomponents.ant.design/favicon.ico"
        style={{
          width: 16,
          height: 16,
          margin: '0 16px',
          marginRight: 10,
        }}
      />
      {!props?.collapsed && 'Preview Pro'}
    </a>
  );
};
const filterByMenuDate = (
  data: MenuDataItem[],
  keyWord: string,
): MenuDataItem[] =>
  data
    .map((item) => {
      if (
        (item.name && item.name.includes(keyWord)) ||
        filterByMenuDate(item.children || [], keyWord).length > 0
      ) {
        return {
          ...item,
          children: filterByMenuDate(item.children || [], keyWord),
        };
      }

      return undefined;
    })
    .filter((item) => item) as MenuDataItem[];

const BasicLayout: React.FC<{ route: RouteConfig }> = (props) => {
  const { route } = props;
  const [menuData, setMenuData] = useState<MenuDataItem[]>([]);
  const [keyWord, setKeyWord] = useState('');
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>(
    proSettings,
  );
  const history = useHistory();

  useEffect(() => {
    const getMenu = async () => {
      const res = await queryMenu();
      if (res) {
        const dataTemp = toTree(res.data, '_id', 'lastMenu', (item) => item);
        setMenuData(dataTemp); // res.data?.menuData
      }
    };
    getMenu();
  }, []);
  const location = useLocation();
  const formatMessage = useFormatMessage();
  // React.useEffect(() => {
  //   ga.send(["pageview", location.pathname]);
  // }, [location]);

  // get children authority
  const authorized = getAuthorityFromRouter(
    menuData,
    location.pathname || '/',
  ) || {
    authority: undefined,
  };
  return (
    <div id="pro-layout">
      <ProLayout
        style={{ height: '100%', minHeight: '100vh' }}
        waterMarkProps={{
          content: '金皮卡',
          fontColor: 'rgba(24,144,255,0.15)',
        }}
        formatMessage={(msg) => formatMessage(msg) as string}
        footerRender={() => defaultFooterDom}
        onMenuHeaderClick={() => history.push('/home')}
        location={{
          pathname: location?.pathname,
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({ id: 'menu.home' }) as string,
          },
          ...routers,
        ]}
        itemRender={(route, params, routes) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to="/home">{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        menuFooterRender={footerRender}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (
            menuItemProps?.isUrl ||
            !menuItemProps?.path ||
            location?.pathname === menuItemProps?.path
          ) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        menuDataRender={
          menuData?.length > 0
            ? () => menuDataRender([...staticMenu, ...menuData])
            : menuDataRender
        }
        menuExtraRender={({ collapsed }) =>
          !collapsed && (
            <Input.Search
              onSearch={(e) => {
                setKeyWord(e);
              }}
            />
          )
        }
        postMenuData={(menus) => filterByMenuDate(menus || [], keyWord)}
        rightContentRender={() => <RightContent />}
        {...settings}
      >
        <Authorized
          routes={loaclRoutes}
          authority={authorized!.authority}
          noMatch={
            <NotFound
              status="403"
              title="403"
              subTitle="对不起！暂无该页面访问权限！请联系管理员或更换账号登录"
              extra={
                (
                  <>
                    <p>
                      <Link to={'/15757182982'}>联系管理员</Link>
                    </p>
                    <Button type="primary">
                      <Link to="/login">重新登录</Link>
                    </Button>
                  </>
                ) as React.ReactDOM | any
              }
            />
          }
        >
          <PageContainer>
            <Suspense
              fallback={
                <Spin
                  size="large"
                  tip="Loading..."
                  style={{ width: '100%', height: '100vh' }}
                />
              }
            >
              {renderRoutes(route.routes)}
            </Suspense>
          </PageContainer>
        </Authorized>
      </ProLayout>
      <SettingDrawer
        pathname={location?.pathname}
        getContainer={() => document.getElementById('pro-layout')}
        settings={settings}
        onSettingChange={(changeSetting) => {
          setSetting(changeSetting);
        }}
        disableUrlParams
      />
    </div>
  );
};

export default BasicLayout;
