import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { database } from '../Firebase/FirebaseSDK';
import { Link, useHistory } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [searchParams, setSearchParams] = useState('');
  const history = useHistory();
  const { LogOut } = useAuth();

  const GetAllBooks = () => {
    database.ref('Books').on('value', snapshot => {
      if(snapshot.exists()){
        //Get The Books Informations
        const temp = snapshot.val();

        setBooks(temp);
      }
    });
  }

  useEffect(() => {
    GetAllBooks();
  }, []);

  const searchResult = () => {
    //Get All Path
    const toBooks = Object.keys(books).filter((b) => {
      if(searchParams === ''){
        return b;
      }else if(b.toLowerCase().includes(searchParams.toLowerCase())){
        return b;
      }
    }).map( function (key, index) {
      return (
        <div key={key} className='pt-2 pb-2'>
          <Link to={`/Books/${key}`} style={{ textDecoration: 'none', color: 'black' }} >
            {`${books[key]['BookName']} by ${books[key]['Author']}`}
          </Link>
      </div>);
    });

    return toBooks;
  }

  return (
    <Card>
      <Card.Body className='text-center'>
        <h2 className='text-center mb-4'>Books</h2>
        <Button onClick={() => LogOut() }>Log Out</Button>
        <Button onClick={() => history.push('/New') }>Add Books</Button>
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
  );
}
