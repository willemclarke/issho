import React from 'react';
import { Config } from '../../common/config';

interface Props {
  config: Config;
}

export const ConfigContext = React.createContext<Props>(null as any);

export const ConfigContextProvider = (props: React.PropsWithChildren<Props>) => {
  return <ConfigContext.Provider value={props}>{props.children}</ConfigContext.Provider>;
};

export const useConfig = () => React.useContext(ConfigContext);
