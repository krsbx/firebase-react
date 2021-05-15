import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useHistory } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [requesting, setRequest] = useState(false);
  const { SignIn } = useAuth();
  const history = useHistory();

  const signIn = async (event) => {
    event.preventDefault();

    try {
      setError('');
      setRequest(true);

      await SignIn(email, password);
      history.push('/Books');
    } catch {
      setError('Email/Password Did Not Match!');
    }
    setRequest(false);
  }

  return (
    <Card>
      <Card.Body>
        <h2 className='text-center mb-4'>Sign In</h2>
        { error && <Alert variant='danger'>{ error }</Alert> }
        <Form onSubmit={ signIn }>
          <Form.Group className='mb-2'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter Emails'
            required/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter Password'
            required/>
          </Form.Group>
          <Button type='submit' disabled={ requesting }
          className='w-100'>Sign In</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
