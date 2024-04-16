import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AudioProvider from './context/AudioContext.jsx';
import './css/main.css';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AudioProvider>
      <App />
    </AudioProvider>
  </React.StrictMode>
)
