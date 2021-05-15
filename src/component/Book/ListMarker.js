import React, { useEffect, useState } from 'react';
import { useBooks } from '../Context/BooksContext';
import { database } from '../Firebase/FirebaseSDK';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

export default function ListMarker() {
  const [details, setDetails] = useState([]);
  const { currentBooks, setCurrentMarker } = useBooks();

  const GetBookMarker = () => {
    database.ref(`Manager`).child(`${currentBooks}`).on('value', snapshot => {
      console.log(snapshot.key);
      if(snapshot.exists()){
        const temp = snapshot.val();
        const toDetails = Object.keys(temp).map(function (key, index) {
          return(
            <>
              <br />
              <Link to={`/Books/${currentBooks}/${key}`} style={{ textDecoration: 'none' }}
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
        <Button className='mb-2'>Edit Store</Button>
        {details}
      </Card.Body>
    </Card>
  )
}
