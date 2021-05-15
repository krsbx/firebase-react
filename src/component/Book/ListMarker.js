import React, { useEffect, useState } from 'react';
import { useBooks } from '../Context/BooksContext';
import { database } from '../Firebase/FirebaseSDK';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

export default function ListMarker() {
  const [details, setDetails] = useState([]);
  const { setCurrentMarker } = useBooks();
  const { booksId } = useParams();
  const history = useHistory();

  const GetBookMarker = () => {
    database.ref(`Manager`).child(`${booksId}`).on('value', snapshot => {
      if(snapshot.exists()){
        const temp = snapshot.val();
        const toDetails = Object.keys(temp).map(function (key, index) {
          return(
            <>
              <br />
              <Link to={`/Books/${booksId}/${key}`} style={{ textDecoration: 'none' }}
                oncLick={() => setCurrentMarker(key)}>
                {`${key}`}
              </Link>
            </>
          )
        });
        setDetails(toDetails);
      }
    });
  };

  useEffect(() => {
    GetBookMarker();
  }, []);

  return (
    <Card>
      <Card.Body className='text-center'>
        <div className='d-flex justify-content-space-between'>
          <Button onClick={() =>  {history.push(`/Store/${booksId}`) } }>Edit Store</Button>
          <Button onClick={() =>  {history.push(`/Marker/${booksId}`) } }>Add Marker </Button>
        </div>
        {details}
      </Card.Body>
    </Card>
  )
}
