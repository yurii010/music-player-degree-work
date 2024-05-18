import { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import myFirebaseConfig from './firebaseConfig.json';

export const FirebaseContext = createContext({});

const FirebaseProvider = (props) => {
  const myApp = initializeApp(myFirebaseConfig);
  const myAuth = getAuth(myApp);
  const myFS = getFirestore(myApp);

  const [firebaseInitializing, setFirebaseInitializing] = useState(true);

  useEffect(() => {
    setFirebaseInitializing(false);
  }, []);
  
  if (firebaseInitializing) {
    return <h1>Loading...</h1>;
  }

  const value = { myApp, myAuth, myFS, };
  const { children } = props;
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  return context;
};

export { FirebaseProvider, useFirebaseContext };