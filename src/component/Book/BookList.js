import React, { useEffect, useState } from 'react';
import { useBooks } from '../Context/BooksContext';
import { database } from '../Firebase/FirebaseSDK';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const { setCurrentBooks } = useBooks();

  const GetAllBooks = () => {
    database.ref('Books').on('value', snapshot => {
      if(snapshot.exists()){
        //Get The Number of Children
        console.log(snapshot.numChildren());
        //Get The Books Informations
        const temp = snapshot.val();

        //Get All Path
        const toBooks = Object.keys(temp).map( function (key, index) {
          return (
          <div>
            <br />
            <Link to={`/Books/${key}`} style={{ textDecoration: 'none' }} onClick={() => setCurrentBooks(key)}>
              {`${temp[key]['BookName']} by ${temp[key]['Author']}`}
            </Link>
          </div>);
        });

        setBooks(toBooks);
      }
    })
  }

  useEffect(() => {
    GetAllBooks();
  }, []);

  return (
    <Card>
      <Card.Body className='text-center'>
        {books}
      </Card.Body>
    </Card>
  );
}
