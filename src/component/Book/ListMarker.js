import React, { useEffect, useState } from 'react';
import { useBooks } from '../Context/BooksContext';
import { database } from '../Firebase/FirebaseSDK';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';

export default function ListMarker() {
  const [details, setDetails] = useState([]);
  const [searchParams, setSearchParams] = useState('');
  const { setCurrentMarker } = useBooks();
  const { booksId } = useParams();
  const history = useHistory();

  const GetBookMarker = () => {
    database.ref(`Manager`).child(`${booksId}`).on('value', snapshot => {
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
      if(searchParams === ''){
        return m;
      }else if(m.toLowerCase().includes(searchParams.toLowerCase())){
        return m;
      }
    }).map( function (key, index) {
      return(
        <div key={key} className='pt-2 pb-2'>
          <Link to={`/Books/${booksId}/${key}`} style={{ textDecoration: 'none', color: 'black' }}
          onClick={() => setCurrentMarker(key)}>
            {`${key}`}
          </Link>
        </div>
      )
    });

    return toDetails;
  }

  return (
    <Card>
      <Card.Body className='text-center'>
        <h2 className='text-center mb-4'>Marker</h2>
        <div className='d-flex justify-content-center'>
          <Button onClick={() =>  {history.push(`/Store/${booksId}`) } }>Edit Store</Button>
          <Button onClick={() =>  {history.push(`/Marker/${booksId}`) } }>Add Marker </Button>
        </div>
        <Form.Group className='mt-2'>
            <Form.Control type='text' value={searchParams}
            onChange={(e) => setSearchParams(e.target.value)}
            placeholder='Search Books'
            required/>
        </Form.Group>
        <div className='scrollThings' style={{ overflow: 'auto', minHeight: '100px', maxHeight: '600px' }}>
          {searchResult()}
        </div>
      </Card.Body>
    </Card>
  )
}
