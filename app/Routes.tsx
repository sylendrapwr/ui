import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import ProductionPage from './containers/Dashboard/Production/ProductionPage';
import ConsumptionPage from './containers/Dashboard/Consumption/ConsumptionPage';
import StoragePage from './containers/Dashboard/Storage/StoragePage';
import Login from './containers/Login/Login';
import Dashboard from './containers/Dashboard';

export default function Routes() {
  return (
    <Switch>
      <Route exact path={routes.LOGIN} component={Login} />
      <Route exact path={routes.DASHBOARD} component={Dashboard} />
    </Switch>
  );
}
