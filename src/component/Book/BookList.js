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
            <Link to={`/Books/${key}`} style={{ textDecoration: 'none', color: 'black' }}
            onClick={() => setCurrentBooks(key)}>
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
        <h2 className='text-center mb-4'>Books</h2>
        <div className='scrollThings' style={{ overflow: 'auto', minHeight: '100px', maxHeight: '600px' }}>
          {books}
        </div>
      </Card.Body>
    </Card>
  );
}
