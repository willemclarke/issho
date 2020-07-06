import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

import './index.less';
import { fromEnv } from '../common/config';
import { ConfigContextProvider } from './context/ConfigContext';

const config = fromEnv();
const Root = () => {
  return (
    <ConfigContextProvider config={config}>
      <App />
    </ConfigContextProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
