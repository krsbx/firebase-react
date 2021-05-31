import React from 'react';
import { useEntry } from '../Context/NewContext';
import { useHistory } from 'react-router-dom';
import { Card, Form, Row, Button, Alert } from 'react-bootstrap';

export default function AddBooks() {
  const history = useHistory();

  const {
    BookName, setBookName,
    Author, setAuthor,
    Model, setModel,
    Size, setSize,
    Cover, setCover,
    Publisher, setPublisher,
    Markers, setMarkers,
    setMarkerImage,
    report, error, 
  } = useEntry();

  const PostBooks = (event) => {
    event.preventDefault();
    
    history.push('/New/Store');
  }

  const HandleFile = (e) => {
    setMarkerImage(e.target.files[0]);

    console.log(e.target.files[0]);
  }

  return (
    <Card>
      <Card.Body>
        <h2 className='text-center mb-4'>New Books</h2>
        { report && <Alert variant='success'> {report} </Alert> }
        { error && <Alert variant='danger'> {error} </Alert> }
        <Form onSubmit={ PostBooks }>
          <Form.Group className='mb-2'>
            <Form.Label>Book Name</Form.Label>
            <Form.Control type='text' value={ BookName }
            onChange={(e) => setBookName(e.target.value)}
            placeholder='Enter Books Name'
            required/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Author</Form.Label>
            <Form.Control type='text' value={ Author }
            onChange={(e) => setAuthor(e.target.value)}
            placeholder='Enter Author Name'
            required/>
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
          <Form.Group as={Row}>
            <div className='mb-3'>
              <label htmlFor="formFile">Marker Image</label>
              <input
                type='file'
                className="form-control"
                accept="image/png, image/jpeg"
                onChange={ (e) => HandleFile(e) }
                id="formFile"
                required
              />
            </div>
          </Form.Group>
          <Button type='submit'
          className='w-100'>Add Books</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
