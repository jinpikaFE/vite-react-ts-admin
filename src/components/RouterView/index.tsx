import React, { Suspense } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import routes from '@config/routes';
import Loading from '@/components/Loading'

const RouterView = () => {
  return (
    // 建议使用 HashRouter
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Switch>
          {routes.map(
            ({ path, component: ComponentName, exact = true, routes = [] }, key) => {
              return (
                <Route
                  exact={routes.length === 0 && exact}
                  key={key}
                  path={path}
                  render={(props: any) => {
                    //登录情况下
                    if (true) {
                      return (
                        ComponentName && (
                          <ComponentName {...props} routes={routes} />
                        )
                      );
                    }
                  }}
                />
              );
            },
          )}
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};

export default RouterView;
