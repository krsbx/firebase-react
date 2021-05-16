import React from 'react';
import { useEntry } from '../Context/NewContext';
import { Card, Form, Button, Alert } from 'react-bootstrap';

export default function AddStore() {

  const {
    BookName,
    Store1, setStore1,
    Store2, setStore2,
    Store3, setStore3,
    Synopsis, setSynopsis,
    report, requesting,
    PostBooksStore
  } = useEntry();

  return (
    <Card>
      <Card.Body>
        <h2 className='text-center mb-4'>{ BookName }</h2>
        { report && <Alert variant='success'> { report } </Alert> }
        <Form onSubmit={ PostBooksStore }>
          <Form.Group className='mb-2'>
            <Form.Label>Store 1 Link</Form.Label>
              <Form.Control type='text' value={ Store1 }
              onChange={(e) => setStore1(e.target.value)}
              placeholder='Enter Store1 Link'
            required/>
            <Form.Label>Store 2 Link</Form.Label>
              <Form.Control type='text' value={ Store2 }
              onChange={(e) => setStore2(e.target.value)}
              placeholder='Enter Store 2 Link'
            required/>
            <Form.Label>Store 3 Link</Form.Label>
              <Form.Control type='text' value={ Store3 }
              onChange={(e) => setStore3(e.target.value)}
              placeholder='Enter Store 3 Link'
            required/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Book Synopsis</Form.Label>
            <Form.Control type='text' value={ Synopsis }
            onChange={(e) => setSynopsis(e.target.value)}
            placeholder='Enter Book Synopsis'
            required/>
          </Form.Group>
          <Button type='submit' disabled={ requesting }
          className='w-100'>Add Store</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
