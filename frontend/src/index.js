import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './ThemeContext';
import App from './App';
import './index.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog, faPen } from '@fortawesome/free-solid-svg-icons'

library.add(faCog, faPen)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);