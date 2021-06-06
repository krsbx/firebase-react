import '../CSS/ScrollAble.css';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { database } from '../Firebase/FirebaseSDK';
import { Link, useHistory } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
import { useBooks } from '../Context/BooksContext';
import Skeleton from '../Skeleton/SkeletonElement';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [searchParams, setSearchParams] = useState('');
  const [loading, setLoading] = useState(true);

  const { currentMode, setCurrentMode } = useBooks();
  const { LogOut } = useAuth();

  const history = useHistory();

  const GetAllBooks = async (mode = '') => {
    const BookRef = database.ref(`${mode}Books`);

    const BooksSnap = await BookRef.once('value');

    setTimeout(() => {
      if(BooksSnap.exists()){
        //Get The Books Informations
        const temp = BooksSnap.val();
  
        setBooks(temp);
      }

      setLoading(false);
    }, 1000);
  }

  const ChangeMode = () => {
    let mode = currentMode;

    if (currentMode === 'Vuforia/'){
      setCurrentMode('');
      mode = '';
    } else {
      setCurrentMode('Vuforia/');
      mode = 'Vuforia/';
    }

    setBooks([]);

    setLoading(true);
    GetAllBooks(mode);
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

      return null;
    }).map( function (key, index) {
      return (
        <div key={key} className='LinkObj pt-2 pb-2'>
          <Link to={`/Books/${key}`} >
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
        <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
          <Button onClick={ LogOut }>Log Out</Button>
          <Button onClick={ () => history.push('/New') }>Add Books</Button>
          <Button onClick={ ChangeMode }>{currentMode === 'Vuforia/' ? 'Hidden' : 'Books'}</Button>
        </div>
        <Form.Group className='mt-2'>
            <Form.Control type='text' value={searchParams}
            onChange={(e) => setSearchParams(e.target.value)}
            placeholder='Search Books'
            required/>
        </Form.Group>
        { loading && books.length === 0 && <Skeleton /> }
        { (!loading || books.length !== 0) &&
          <div className='scrollThings'>
            { searchResult() }
          </div>
        }
      </Card.Body>
    </Card>
  );
}
