import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';

import App from './App';
import { worker } from './mocks/browsers';
import './index.css';

const client = new QueryClient();

async function prepare() {
  if (import.meta.env.DEV) {
    return worker.start();
  }

  return Promise.resolve();
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
});
