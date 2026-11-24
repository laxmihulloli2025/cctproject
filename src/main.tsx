import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ParkingProvider } from './context/ParkingContext';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <ParkingProvider>
          <App />
        </ParkingProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
