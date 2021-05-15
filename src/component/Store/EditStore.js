import React, { useEffect, useState } from 'react';
import { useBooks } from '../Context/BooksContext';
import { database } from '../Firebase/FirebaseSDK';
import { Link, useParams } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';


export default function EditStore() {

  const [Store1, setStore1] = useState('');
  const [Store2, setStore2] = useState('');
  const [Store3, setStore3] = useState('');
  const [Synopsis, setSynopsis] = useState('');
  const [BookName, setBookName] = useState('');
  const [requesting, setRequest] = useState(false);
  const [report, setReport] = useState('');

  const { currentBooks } = useBooks();

  const GetStore = () => {
    database.ref('Books').child(currentBooks).on('value', snapshot => {
      if(snapshot.exists()){
        const result = snapshot.val();
        setBookName(result['BookName']);
      }
    });

    database.ref('Store').child(currentBooks).on('value', snapshot => {
      if(snapshot.exists()){
        const result = snapshot.val();
        setStore1(result['Store1']);
        setStore2(result['Store2']);
        setStore3(result['Store3']);
        setSynopsis(result['Synopsis']);
      }
    });
  };

  const UpdateStore = async (event) => {
    event.preventDefault();

    setReport('');
    setRequest(true);

    await database.ref('Store').child(currentBooks).update({
      Store1: Store1,
      Store2: Store2,
      Store3: Store3,
      Synopsis: Synopsis,
    });

    setReport('Data Updated Successfully!');
    setRequest(false);
  };

  useEffect(() => {
    GetStore();
  }, []);

  return (
    <Card>
      <Card.Body>
        <h2 className='text-center mb-4'>{ BookName }</h2>
        { report && <Alert variant='success'> {report} </Alert> }
        <Form onSubmit={ UpdateStore }>
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
          className='w-100'>Update Store</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}