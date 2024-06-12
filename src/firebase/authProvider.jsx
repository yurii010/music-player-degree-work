import { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebaseContext } from './firebaseProvider';
import axios from 'axios';

export const AuthContext = createContext({});
const PROFILE_COLLECTION = 'users';

const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authErrorMessages, setAuthErrorMessages] = useState();
  const [userPhoto, setUserPhoto] = useState();
  const [userPlaylists, setUserPlaylists] = useState([]);
  const { myAuth, myFS } = useFirebaseContext();

  useEffect(() => {
    if (myAuth) {
      let unsubscribe = onAuthStateChanged(myAuth, (user) => {
        if (user) {
          setUser(user);
          if (!sessionStorage.getItem('initialized')) {
            logoutFunction();
            sessionStorage.setItem('initialized', 'true');
          }
        }
        setAuthLoading(false);
      });
      return unsubscribe;
    }
  }, [myAuth]);

  useEffect(() => {
    if (myAuth) {
      let unsubscribe = onAuthStateChanged(myAuth, (user) => {
        if (user) {
          setUser(user);
        }
        setAuthLoading(false);
      });
      return unsubscribe;
    }
  }, [myAuth]);

  useEffect(() => {
    let unsubscribe = null;
    const listenToUserDoc = async (uid) => {
      try {
        let docRef = doc(myFS, PROFILE_COLLECTION, uid);
        unsubscribe = await onSnapshot(docRef,
          (docSnap) => {
            let profileData = docSnap.data();
            console.log('Got user profile:', profileData, docSnap);
            if (!profileData) { setAuthErrorMessages([`No profile doc found in Firestore at: ${docRef.path}`]); }
            setProfile(profileData);
          },
          (firestoreErr) => {
            console.error(`onSnapshot() callback failed with: ${firestoreErr.message}`, firestoreErr);
            setAuthErrorMessages([firestoreErr.message, 'Have you initialized your Firestore database?']);
          }
        );
      } catch (ex) {
        console.error(`useEffect() calling onSnapshot() failed with: ${ex.message}`);
        setAuthErrorMessages([ex.message]);
      }
    };

    if (user?.uid) {
      listenToUserDoc(user.uid);
      return () => {
        unsubscribe && unsubscribe();
      };
    } else if (!user) {
      setAuthLoading(true);
      setProfile(null);
      setAuthErrorMessages(null);
    }
  }, [user, setProfile, myFS]);

  /**
   * @param {string} 
   * @param {string} 
   * @param {string} 
   * @returns {boolean} 
   */
  const registerFunction = async (email, password, username = '') => {
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(myAuth, email, password);
    } catch (ex) {
      setAuthErrorMessages([console.log(ex.message)]);
      return false;
    }

    try {
      let user = userCredential.user;
      let userDocRef = doc(myFS, 'users', user.uid);
      let userDocData = { uid: user.uid, email: email, username: username, dateCreated: serverTimestamp(), };
      localStorage.setItem('uid', user.uid);
      await setDoc(userDocRef, userDocData);
      return true;
    } catch (ex) {
      console.error(`registerFunction() failed with: ${ex.message}`);
      setAuthErrorMessages([ex.message, 'Did you enable the Firestore Database in your Firebase project?',]);
      return false;
    }
  };

  const loginFunction = async (email, password) => {
    try {
      let userCredential = await signInWithEmailAndPassword(myAuth, email, password);
      let user = userCredential.user;
      if (!user?.uid) {
        let msg = `No UID found after signIn!`;
        console.error(msg);
      }
      if (user) { localStorage.setItem('uid', user.uid) }
      setUser(user);
      return true;
    } catch (ex) {
      let msg = `Login failure for email(${email}: ${ex.message})`;
      console.error(msg);
      setAuthErrorMessages([ex.message]);
      return false;
    }
  };

  const logoutFunction = async () => {
    try {
      setUser(null);
      await signOut(myAuth);
      console.log('Signed Out');
      localStorage.removeItem('uid', user.uid);
      window.location.reload();
      return true;
    } catch (ex) {
      console.error(ex);
      setAuthErrorMessages([ex.message]);
      return false;
    }
  };

  if (authLoading) {
    return <h1>Loading</h1>;
  }

  const loadUserAvatar = async (uid) => {
    try {
      const response = await axios.post(`http://localhost:8081/loadAvatar`, { uid });
      const { uphoto } = response.data;
      if (uphoto == "") {
        setUserPhoto('https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png');
      } else {
        setUserPhoto(`./public/images/${uphoto}`);
      }
    } catch (error) {
      console.error("Error fetching user avatar", error);
    }
  };

  const getPlaylists = async (uid) => {
    try {
      const response = await axios.post('http://localhost:8081/getPlaylists', { uid });
      setUserPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const updateUserPlaylists = async (playlists) => {
    setUserPlaylists(playlists);
  };

  const value = {
    authErrorMessages,
    authLoading,
    profile,
    user,
    userPhoto,
    userPlaylists,
    getPlaylists,
    updateUserPlaylists,
    loadUserAvatar,
    login: loginFunction,
    logout: logoutFunction,
    register: registerFunction,
  };
  const children = props.children;
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};

export { AuthProvider, useAuthContext };