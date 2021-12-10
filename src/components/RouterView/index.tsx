import React, { Suspense } from 'react';
import { renderRoutes } from 'react-router-config';
import routes from '@config/routes';
import Loading from '@/components/Loading';
import GuardRouter from './GuardRouter';

const RouterView = () => {
  return (
    // 建议使用 HashRouter
    <Suspense fallback={<Loading />}>
      <GuardRouter>{renderRoutes(routes)}</GuardRouter>
    </Suspense>
  );
};

export default RouterView;
