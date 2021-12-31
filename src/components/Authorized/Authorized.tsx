import React from 'react';
import { Result } from 'antd';
import check from './CheckPermissions';
import type { IAuthorityType } from './CheckPermissions';
import type AuthorizedRoute from './AuthorizedRoute';
import type Secured from './Secured';
import { getAuthorityFromRouter } from '@/utils/untils';
import { useLocation } from 'react-router-dom';
import NotFound from '../NotFound';
import type { RouteConfig } from 'react-router-config';

type AuthorizedProps = {
  authority: IAuthorityType;
  noMatch?: React.ReactNode;
  routes: RouteConfig[];
};

type IAuthorizedType = React.FunctionComponent<AuthorizedProps> & {
  Secured: typeof Secured;
  check: typeof check;
  AuthorizedRoute: typeof AuthorizedRoute;
};

const Authorized: React.FunctionComponent<AuthorizedProps> = ({
  routes,
  children,
  authority,
  noMatch = (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
    />
  ),
}) => {
  const childrenRender: React.ReactNode =
    typeof children === 'undefined' ? null : children;
  const dom = check(authority, childrenRender, noMatch);
  const location = useLocation();
  // 找不到路由的404
  const authorized =
    getAuthorityFromRouter(routes, location.pathname || '/') || null;

  return <>{authorized ? dom : <NotFound />}</>;
};

export default Authorized as IAuthorizedType;
