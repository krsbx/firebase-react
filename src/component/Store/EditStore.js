import React, { useEffect, useState, useRef } from 'react';
import { database } from '../Firebase/FirebaseSDK';
import { useParams } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useBooks } from '../Context/BooksContext';


export default function EditStore() {

  const [Store1, setStore1] = useState('');
  const [Store2, setStore2] = useState('');
  const [Store3, setStore3] = useState('');
  const [Synopsis, setSynopsis] = useState('');
  const [BookName, setBookName] = useState('');
  const [requesting, setRequest] = useState(false);
  const [report, setReport] = useState('');

  const { currentMode } = useBooks();

  const { booksId } = useParams();

  const GetStore = useRef(() => {});

  GetStore.current = () => {
    database.ref(`${currentMode}Books`).child(booksId).get().then(snapshot => {
      if(snapshot.exists()){
        const result = snapshot.val();
        setBookName(result['BookName']);
      }
    });

    database.ref(`${currentMode}Store`).child(booksId).get().then(snapshot => {
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

    await database.ref(`${currentMode}Store`).child(booksId).update({
      Store1: Store1,
      Store2: Store2,
      Store3: Store3,
      Synopsis: Synopsis,
    });

    setReport('Data Updated Successfully!');
    setRequest(false);
  };

  useEffect(() => {
    GetStore.current();
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
