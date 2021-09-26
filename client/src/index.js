import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {UserStateProvider} from './Context/userAuth/Context'

ReactDOM.render(
  // <React.StrictMode>
    <UserStateProvider>
      <App />
    </UserStateProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

