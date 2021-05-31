import React, { useEffect, useState } from 'react';
import { database } from '../Firebase/FirebaseSDK';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { deleteTarget } from '../Vuforia/VWS_Request';
import { useBooks } from '../Context/BooksContext';

export default function ListMarker() {
  const [details, setDetails] = useState([]);
  const [report, setReport] = useState('');
  const [requesting, setRequest] = useState(false);
  const [searchParams, setSearchParams] = useState('');
  const seconds = 60 * 1000;
  const timePass = 2 * seconds;

  const { currentMode } = useBooks();

  const { booksId } = useParams();
  const history = useHistory();

  const GetBookMarker = () => {
    
    database.ref(`${currentMode}Manager`).child(`${booksId}`).on('value', snapshot => {
      if(snapshot.exists()){
        //Get The Marker Informations
        const temp = snapshot.val();
        
        setDetails(temp);
      }
    });
  };

  useEffect(() => {
    GetBookMarker();
  }, []);

  const searchResult = () => {
    //Get All Path
    const toDetails = Object.keys(details).filter((m) => {
      if (searchParams === ''){
        return m;
      }else if(m.toLowerCase().includes(searchParams.toLowerCase())){
        return m;
      }

      return null;
    }).map( function (key, index) {
      const timestamp = details[key]['updatedAt'];
      const converted = new Date(timestamp).getTime();
      const now = new Date().getTime();

      if (timestamp ? (now-converted > timePass) : true) {
        return(
          <div key={key} className='pt-2 pb-2'>
            <Link to={`/Books/${booksId}/${key}`} style={{ textDecoration: 'none', color: 'black' }} >
              {`${key}`}
            </Link>
          </div>
        )
      }

      return null;
    });

    return toDetails;
  }

  const DeleteBooks = async () => {
    setReport('');
    setRequest(true);

    const managerRef = database.ref(`${currentMode}Manager`).child(`${booksId}`);

    const managerSnap = await managerRef.once('value');

    let ManagerId = [];

    if(managerSnap.exists()){
      //Get The Marker Informations
      const temp = managerSnap.val();
      
      const managerName = Object.keys(temp).map((k, id) => {
        return k;
      });

      ManagerId = managerName;
    }

    const UID = [];
    
    for(var i = 0; i < ManagerId.length; i++) {
      const cloudRef = database.ref(`${currentMode}Cloud Reco`).child(`${booksId}<bookPlat>${ManagerId[i]}`);

      const cloudSnap = await cloudRef.once('value');

      if (cloudSnap.exists()) {
        //Get The UID Informations
        const temp = cloudSnap.val();
        UID.push(temp['UID']);
      }
    };

    //Delete Markers in VWS
    while (UID.length !== 0) {
      const id = UID.shift();
      await deleteTarget(id);
    }

    //Clear Cloud Reco Sections
    ManagerId.map(manager => {
      database.ref(`${currentMode}Cloud Reco`).child(`${booksId}<bookPlat>${manager}`).remove();
      return null;
    });

    //Clear Marker Sections
    ManagerId.map(manager => {
      database.ref(`${currentMode}Marker`).child(`${booksId}<bookPlat>${manager}`).remove();
      return null;
    });

    //Remove Book Entry
    database.ref(`${currentMode}Books`).child(`${booksId}`).remove();
    database.ref(`${currentMode}Manager`).child(`${booksId}`).remove();
    database.ref(`${currentMode}Store`).child(`${booksId}`).remove();

    setReport('Books Deleted Successfully!');

    setTimeout(5000);

    history.push('/Books/');
  }

  return (
    <Card>
      <Card.Body className='text-center'>
        <h2 className='text-center mb-4'>Marker</h2>
        { report && <Alert variant='success'> {report} </Alert> }
        <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
          <Button onClick={() => history.push(`/Store/${booksId}`) } disabled={requesting} >Edit Store</Button>
          <Button onClick={() => history.push(`/Marker/${booksId}`) } disabled={requesting} >Add Marker</Button>
          <Button className='btn btn-danger' onClick={() => DeleteBooks() } disabled={requesting}>Delete Books</Button>
        </div>
        <Form.Group className='mt-2'>
            <Form.Control type='text' value={searchParams}
            onChange={(e) => setSearchParams(e.target.value)}
            placeholder='Search Marker'
            required/>
        </Form.Group>
        <div className='scrollThings' style={{ overflow: 'auto', minHeight: '100px', maxHeight: '600px' }}>
          {searchResult()}
        </div>
      </Card.Body>
    </Card>
  )
}
