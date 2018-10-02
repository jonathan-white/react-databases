import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Projects from '../Pages/Projects';

const routes = (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/projects" component={Projects} />
    </Switch>
  </Router>
);

export default routes;
