import React, { useEffect, useState } from 'react';
import { database, timestamp } from '../Firebase/FirebaseSDK';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Form, Row, Button, Alert } from 'react-bootstrap';
import { newTarget, getMarker64 } from '../Vuforia/VWSHandler';
import { updateTarget, deleteTarget } from '../Vuforia/VWS_Request';
import { useBooks } from '../Context/BooksContext';

export default function EditMarker() {
  const [BookName, setBookName] = useState('');
  const [Author, setAuthor] = useState('');
  const [Model, setModel] = useState('');
  const [Size, setSize] = useState('');
  const [Cover, setCover] = useState('');
  const [Publisher, setPublisher] = useState('');
  const [Markers, setMarkers] = useState('');
  const [Synopsis, setSynopsis] = useState('');
  const [UID, setUID] = useState('');
  const [MarkerImage, setMarkerImage] = useState({});
  const [requesting, setRequest] = useState(false);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');

  const { currentMode } = useBooks();

  const history = useHistory();

  const { booksId, markerId } = useParams();

  const GetMarkerDetails = () => {
    database.ref(`${currentMode}Books`).child(`${booksId}`).get().then(snapshot => {
      if(snapshot.exists()){
        const result = snapshot.val();
        setAuthor(result['Author']);
        setBookName(result['BookName']);
        setCover(result['Cover']);
        setPublisher(result['Publisher']);
      }
    });

    database.ref(`${currentMode}Cloud Reco`).child(`${booksId}<bookPlat>${markerId}`).get().then(snapshot => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setUID(result['UID']);
      }
    });
    
    database.ref(`${currentMode}Marker`).child(`${booksId}<bookPlat>${markerId}`).get().then(snapshot => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setModel(result['Model']);
        setSize(result['Size']);
        setMarkers(markerId);
      }
    });

    database.ref(`${currentMode}Store`).child(`${booksId}`).get().then(snapshot => {
      if(snapshot.exists()){
        const result = snapshot.val();
        setSynopsis(result['Synopsis']);
      }
    });
  };

  // #region Update Functions

  const UpdateMarker = async (event) => {
    event.preventDefault();

    setReport('');
    setError('');
    setRequest(true);

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

    const data = newTarget(Metadata, images64);

    const request = await updateTarget(UID, data);

    try {
      if (request.data['result_code'] === 'Success'){
        await database.ref(`${currentMode}Books`).child(booksId).update({
          Cover: Cover,
          Publisher: Publisher,
        });

        await database.ref(`${currentMode}Manager`).child(booksId).child(Markers).update({
          updatedAt: timestamp,
        });
    
        await database.ref(`${currentMode}Marker`).child(`${booksId}<bookPlat>${markerId}`).update({
          Author: Author,
          Cover: Cover,
          Marker: Markers,
          Model: Model,
          Name: BookName,
          Publisher: Publisher,
          Size: Size,
          Synopsis: Synopsis,
        });
    
        setReport('Data Updated Successfully!');

        setTimeout(3000);

        history.push(`/Books`);

      } else {
        setError(request.data['result_code']);
      }
    } catch {
      setError('Bad Request');
    }

    setRequest(false);
  }

  const HandleFile = (e) => {
    setMarkerImage(e.target.files[0]);

    console.log(e.target.files[0]);
  }

  // #endregion

  // #region Delete Marker
  
  const DeleteMarker = async () => {

    setReport('');
    setError('');
    setRequest(true);
    
    const request = await deleteTarget(UID);

    try {
      if (request.data['result_code'] === 'Success') {
        //Remove Marker Entry on Cloud Reco Sections
        await database.ref(`${currentMode}Cloud Reco`).child(`${booksId}<bookPlat>${markerId}`).remove();

        //Remove Marker Entry on Manager Sections
        await database.ref(`${currentMode}Manager`).child(`${booksId}`).child(`${markerId}`).remove();

        //Remove Marker Entry on Marker Sections
        await database.ref(`${currentMode}Marker`).child(`${booksId}<bookPlat>${markerId}`).remove();

        let existed = false;

        const existRef = database.ref(`${currentMode}Manager`).child(`${booksId}`);
        const existSnap = await existRef.once('value');
        existed = existSnap.exists();

        setReport('Marker Deleted Successfully!');

        setTimeout(3000);

        //No Entry found
        //  Remove Books Entry
        if (existed === false) {
          database.ref(`${currentMode}Books`).child(`${booksId}`).remove();
          database.ref(`${currentMode}Store`).child(`${booksId}`).remove();
          history.push('/Books/');
        } else {
          history.push(`/Books/${booksId}`);
        }
        
      } else {
        setError(request.data['result_code']);
      }
    } catch {
      setError('Bad Request');
    }

    setRequest(false);
  };
  
  // #endregion

  useEffect(() => {
    GetMarkerDetails();
  }, []);

  return (
    <Card>
      <Card.Body>
        <h2 className='text-center mb-4'>{ Markers }</h2>
        { report && <Alert variant='success'> {report} </Alert> }
        { error && <Alert variant='danger'> {error} </Alert> }
        <Form onSubmit={ UpdateMarker }>
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
          className='w-100'>Update Marker</Button>
          <Button onClick={ DeleteMarker } disabled={ requesting }
          className='btn btn-danger w-100'>Delete Marker</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
