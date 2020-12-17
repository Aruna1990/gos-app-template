import React from 'react';
import AdminFrame from '../layouts/AdminFrame';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { adminRoutes } from '../routes';

function Admin(props) {
  return (
    <AdminFrame menuData={adminRoutes} title={props.title}>
      <Switch>
        {adminRoutes.map(route => {
          return (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              render={routeProps => {
              return <route.component {...routeProps} />
              }}
            />
          )
        })}
        <Redirect to='/list' />
      </Switch>
    </AdminFrame>
  );
}

export default Admin;
