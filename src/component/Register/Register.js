import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useHistory } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requesting, setRequest] = useState(false);
  const { SignUp } = useAuth();
  const history = useHistory();

  const CreateUser = async (event) => {
    event.preventDefault();

    if(email === undefined){
      console.log('Email Is Empty');
      return;
    }

    if(password === undefined){
      console.log('Password Is Empty');
      return;
    }

    setRequest(true);
    try {
      await SignUp(email, password);
      history.push('/Login');
    } catch(error) {
      console.log(error.message);
      return;
    }
    setRequest(false);
  }

  return (
    <form onSubmit={ CreateUser }>
      <input type="text" value={email} onChange={e => setEmail(e.target.value)}></input>
      <br /><input type="password" value={password} onChange={e => setPassword(e.target.value)}></input>
      <br /><button type="submit" disabled={requesting}>Register</button>
    </form>
  );
}
