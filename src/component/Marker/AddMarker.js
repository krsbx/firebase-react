import React, { useEffect, useState } from 'react';
import { database, timestamp } from '../Firebase/FirebaseSDK';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Form, Row, Button, Alert, FormControl } from 'react-bootstrap';
import { target, getMarker64 } from '../Vuforia/VWSHandler';
import { addTarget } from '../Vuforia/VWS_Request';
import { useBooks } from '../Context/BooksContext';

export default function AddMarker() {
  const [BookName, setBookName] = useState('');
  const [Author, setAuthor] = useState('');
  const [Model, setModel] = useState('');
  const [Size, setSize] = useState('');
  const [Cover, setCover] = useState('');
  const [Publisher, setPublisher] = useState('');
  const [Markers, setMarkers] = useState('');
  const [Synopsis, setSynopsis] = useState('');
  const [MarkerImage, setMarkerImage] = useState({});
  const [requesting, setRequest] = useState(false);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const { currentMode } = useBooks();

  const { booksId } = useParams();

  const GetBookInformations = () => {
    database.ref(`${currentMode}Books`).child(`${booksId}`).get().then(snapshot => {
      if(snapshot.exists()){
        const result = snapshot.val();
        setAuthor(result['Author']);
        setBookName(result['BookName']);
        setCover(result['Cover']);
        setPublisher(result['Publisher']);
      }
    });

    database.ref(`${currentMode}Store`).child(booksId).get().then(snapshot => {
      if(snapshot.exists()){
        const result = snapshot.val();
        setSynopsis(result['Synopsis']);
      }
    });
  };

  const UploadMarker = async (event) => {
    event.preventDefault();

    setReport('');
    setError('');
    setRequest(true);

    let existed = false;

    database.ref(`${currentMode}Manager`).child(booksId).child(`${Markers}`).get().then(snapshot => {
      if(snapshot.exists()){
        setError('Marker Already Exist!');
        setRequest(false);
        existed = true;
        return;
      }
    });

    if (existed === true) {
      return;
    }

    const Metadata = {
      Author: Author,
      Cover: Cover,
      Marker: Markers,
      Model: Model,
      Name: BookName,
      Publisher: Publisher,
      Size: Size,
      Synopsis: Synopsis,
    };

    const images64 = await getMarker64(MarkerImage);

    const data = target(`${booksId}<bookPlat>${Markers}`, Metadata, images64);

    const request = await addTarget(data);

    try {
      if (request.data['result_code'] === 'TargetCreated'){
        //Update Books Informations
        await database.ref(`${currentMode}Books`).child(booksId).update({
          Cover: Cover,
          Publisher: Publisher,
        });

        //Add New Marker To Cloud Reco Sections
        await database.ref(`${currentMode}Cloud Reco`).child(`${booksId}<bookPlat>${Markers}`).update({
          UID: request.data['target_id'],
        });

        //Add New Marker To Manager Sections
        await database.ref(`${currentMode}Manager`).child(booksId).child(Markers).update({
          Name: Markers,
          createdAt: timestamp,
          updatedAt: timestamp,
        });

        //Add New Marker To Marker Sections
        await database.ref(`${currentMode}Marker`).child(`${booksId}<bookPlat>${Markers}`).update({
          Author: Author,
          Cover: Cover,
          Marker: Markers,
          Model: Model,
          Name: BookName,
          Publisher: Publisher,
          Size: Size,
          Synopsis: Synopsis,
        });

        setReport('Marker Uploaded Successfully!');

        setTimeout(3000);

        history.push(`/Books/${booksId}`);
      } else {
        setError(request.data['result_code']);
      }
    } catch {
      setError('Bad Request!');
    }

    setRequest(false);
  }

  const HandleFile = (e) => {
    setMarkerImage(e.target.files[0]);

    console.log(e.target.files[0]);
  }

  useEffect(() => {
    GetBookInformations();
  }, []);

  return (
    <Card>
      <Card.Body>
        <h2 className='text-center mb-4'>{ BookName }</h2>
        { report && <Alert variant='success'> {report} </Alert> }
        { error && <Alert variant='danger'> {error} </Alert> }
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
          <Button type='submit' disabled={ requesting }
          className='w-100'>Upload Marker</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
