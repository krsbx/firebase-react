import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useHistory } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';

export default function Register() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [requesting, setRequest] = useState(false);
  const { SignUp } = useAuth();
  const history = useHistory();

  const CreateUser = async (event) => {
    event.preventDefault();

    if(password !== passwordConfirm){
      return setError('Password Did Not Match');
    }

    try {
      setError('');
      setRequest(true);

      await SignUp(email, password);
      history.push('/Login');
    } catch {
      setError('Failed to Create Account');
    }
    setRequest(false);
  }

  return (
    <Card>
      <Card.Body>
        <h2 className='text-center mb-4'>Register</h2>
        { error && <Alert variant='danger'>{ error }</Alert> }
        <Form onSubmit={ CreateUser }>
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
          <Form.Group className='mb-2'>
            <Form.Label>Password Confirmations</Form.Label>
            <Form.Control type='password' value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder='Enter Password'
            required/>
          </Form.Group>
          <Button type='submit' disabled={ requesting }
          className='w-100'>Register</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
