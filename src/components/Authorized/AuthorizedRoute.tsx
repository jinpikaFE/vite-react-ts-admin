import type { RouteConfig } from 'react-router-config';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Authorized from './Authorized';
import type { IAuthorityType } from './CheckPermissions';

type AuthorizedRouteProps = {
  routes: RouteConfig[];
  currentAuthority: string;
  component: React.ComponentClass<any, any>;
  render: (props: any) => React.ReactNode;
  redirectPath: string;
  authority: IAuthorityType;
};

const AuthorizedRoute: React.SFC<AuthorizedRouteProps> = ({
  routes,
  component: Component,
  render,
  authority,
  redirectPath,
  ...rest
}) => (
  <Authorized
    routes={routes}
    authority={authority}
    noMatch={
      <Route
        {...rest}
        render={() => <Redirect to={{ pathname: redirectPath }} />}
      />
    }
  >
    <Route
      {...rest}
      render={(props: any) =>
        Component ? <Component {...props} /> : render(props)
      }
    />
  </Authorized>
);

export default AuthorizedRoute;
