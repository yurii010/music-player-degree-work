import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AudioProvider from './context/AudioContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseProvider } from './firebase/firebaseProvider.jsx';
import { AuthProvider } from './firebase/authProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FirebaseProvider>
      <AuthProvider>
        <AudioProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AudioProvider>
      </AuthProvider>
    </FirebaseProvider>
  </React.StrictMode>
)
