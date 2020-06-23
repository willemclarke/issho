import React from 'react';
import useSocket from 'use-socket.io-client';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Room } from './pages/Room';

export const App = () => {
  const [socket] = useSocket('ws://localhost:3000', { autoConnect: true });
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route exact path="/rooms/:roomId">
          <Room socket={socket} />
        </Route>
      </Switch>
    </Router>
  );
};
