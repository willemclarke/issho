import React from 'react';
import useSocket from 'use-socket.io-client';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Room } from './pages/Room';
import { Layout } from 'antd';
import { NavBar } from './components/NavBar';

export const App = () => {
  const [socket] = useSocket('ws://localhost:3000', { autoConnect: true });

  return (
    <Router>
      <Layout style={{ height: '100vh', backgroundColor: 'white' }}>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Landing socket={socket} />
          </Route>
          <Route exact path="/rooms/:roomId">
            <Room socket={socket} />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};
