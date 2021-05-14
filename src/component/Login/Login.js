import React, { useState } from 'react';
import { auth } from '../Firebase/FirebaseSDK';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async (event) => {
    event.preventDefault();
    await auth.signInWithEmailAndPassword(email, password).then((credential) => {
      window.location.href = '/Books';
    });
  }

  return (
    <form onSubmit={ signIn }>
      <input type="text" value={email} onChange={e => setEmail(e.target.value)}></input>
      <br /><input type="password" value={password} onChange={e => setPassword(e.target.value)}></input>
      <br /><button type="submit">Sign In</button>
    </form>
  );
}
