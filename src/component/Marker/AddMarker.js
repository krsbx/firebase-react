import React, { useEffect, useState } from 'react';
import { useBooks } from '../Context/BooksContext';
import { database } from '../Firebase/FirebaseSDK';
import { Link, useParams } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';

export default function AddMarker() {
  const [BookName, setBookName] = useState('');
  const [Author, setAuthor] = useState('');
  const [Model, setModel] = useState('');
  const [Size, setSize] = useState('');
  const [Cover, setCover] = useState('');
  const [Publisher, setPublisher] = useState('');
  const [Markers, setMarkers] = useState('');
  const [Synopsis, setSynopsis] = useState('');
  const [requesting, setRequest] = useState(false);
  const [report, setReport] = useState('');

  const { currentBooks } = useBooks();

  const GetBookInformations = () => {
    database.ref(`Books`).child(`${currentBooks}`).on('value', snapshot => {
      if(snapshot.exists()){
        const result = snapshot.val();
        setAuthor(result['Author']);
        setBookName(result['BookName']);
        setCover(result['Cover']);
        setPublisher(result['Publisher']);
      }
    });

    database.ref('Store').child(currentBooks).on('value', snapshot => {
      if(snapshot.exists()){
        const result = snapshot.val();
        setSynopsis(result['Synopsis']);
      }
    });
  };

  const UploadMarker = async (event) => {
    event.preventDefault();

    setReport('');
    setRequest(true);

    await database.ref('Books').child(currentBooks).update({
      Cover: Cover,
      Publisher: Publisher,
    });

    await database.ref(`Marker`).child(`${currentBooks}<bookPlat>${Markers}`).update({
      Author: Author,
      Cover: Cover,
      Marker: Markers,
      Model: Model,
      Name: BookName,
      Publisher: Publisher,
      Size: Size,
      Synopsis: Synopsis,
    });

    await database.ref('Manager').child(currentBooks).child(Markers).update({
      Name: Markers,
    });

    setReport('Marker Uploaded Successfully!');
    setRequest(false);
  }

  useEffect(() => {
    GetBookInformations();
  }, []);

  return (
    <Card>
      <Card.Body>
        <h2 className='text-center mb-4'>{ BookName }</h2>
        { report && <Alert variant='success'> {report} </Alert> }
        <Form onSubmit={ UploadMarker }>
          <Form.Group className='mb-2'>
            <Form.Label>Book Name</Form.Label>
            <Form.Control type='text' value={ BookName }
            onChange={(e) => setBookName(e.target.value)}
            placeholder='Enter Books Name'
            readOnly/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Author</Form.Label>
            <Form.Control type='text' value={ Author }
            onChange={(e) => setAuthor(e.target.value)}
            placeholder='Enter Author Name'
            readOnly/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Book Marker Name</Form.Label>
            <Form.Control type='text' value={ Markers }
            onChange={(e) => setMarkers(e.target.value)}
            placeholder='Enter Book Marker Name'
            required/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>3D Model Link</Form.Label>
            <Form.Control type='text' value={ Model }
            onChange={(e) => setModel(e.target.value)}
            placeholder='Enter 3D Model Link'
            required/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>3D Model Size</Form.Label>
            <Form.Control type='text' value={ Size }
            onChange={(e) => setSize(e.target.value)}
            placeholder='Enter 3D Model Size'
            required/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Book Cover Link</Form.Label>
            <Form.Control type='text' value={ Cover }
            onChange={(e) => setCover(e.target.value)}
            placeholder='Enter 3D Model Link'
            required/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Book Publisher Logo Link</Form.Label>
            <Form.Control type='text' value={ Publisher }
            onChange={(e) => setPublisher(e.target.value)}
            placeholder='Enter Book Publisher Logo Link'
            required/>
          </Form.Group>
          <Button type='submit' disabled={ requesting }
          className='w-100'>Upload Marker</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
