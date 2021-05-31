import { useState, useEffect, useContext, createContext } from 'react';
import { auth } from '../Firebase/FirebaseSDK';
import { useHistory } from 'react-router-dom';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({children}) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  function SignUp(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function SignIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function LogOut() {
    return auth.signOut();
  }

  useEffect(() => {
    const changes = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return changes;
  }, []);

  const vals = {
    currentUser,
    SignUp,
    SignIn,
    LogOut,
  };

  return (
    <AuthContext.Provider value={vals}>
      { !currentUser && history.push(`/Login`) }
      { !loading && children }
    </AuthContext.Provider>
  )
}