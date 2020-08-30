import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Store } from '../redux/reducers/types';
import Routes from '../Routes';

type Props = {
  store: Store;
  history: History;
};

const Root = ({ store, history, persistor }: Props) => {
  const touchScreenHandle = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment) {
      document.body.style.cursor = 'none';
    }
  };

  useEffect(() => {
    touchScreenHandle();
  }, []);

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes />
        </PersistGate>
      </ConnectedRouter>
    </Provider>
  );
};

export default hot(Root);
