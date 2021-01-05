import React from 'react';
import MainFrame from '../layouts/MainFrame';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { appRoutes } from '../routes';

function App(props) {
  return (
    <MainFrame menuData={appRoutes} title={props.title}>
      <Switch>
        {appRoutes.map(route => {
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
    </MainFrame>
  );
}

export default App;
