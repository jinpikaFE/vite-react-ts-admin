import { renderRoutes } from 'react-router-config';
import type { RouteConfig } from 'react-router-config';
import React from 'react';

const Layout: React.FC<{ route: RouteConfig }> = (props) => {
  const { route } = props;
  return <>{renderRoutes(route.routes)}</>;
};

export default Layout;
