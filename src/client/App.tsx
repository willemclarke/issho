import { Layout } from 'antd';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Landing } from './pages/Landing';
import { Room } from './pages/Room';

export const App = () => {
  return (
    <Router>
      <Layout style={{ height: '100%' }}>
        <NavBar />
        <Layout style={{ overflowY: 'auto', height: '100%', background: '#fff' }}>
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>
            <Route exact path="/rooms/:roomId">
              <Room />
            </Route>
          </Switch>
        </Layout>
      </Layout>
    </Router>
  );
};
