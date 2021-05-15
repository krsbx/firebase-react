import Login from './component/Login/Login';
import Register from './component/Register/Register';
import BoookList from './component/Book/BookList';
import BookDetails from './component/Book/ListMarker';
import { AuthProvider } from './component/Context/AuthContext';
import { BooksProvider } from './component/Context/BooksContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap'

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Router>
        <Container
        className='d-flex align-items-center justify-content-center'
        style={{ minHeight: '100vh' }}>
          <div className='w-100' style={{ maxWidth: '400px' }}>
            <AuthProvider>
              <Switch>
                {/* Dashboard = Books List */}
                <Route exact path='/' component={Login} />
                {/* Register Page */}
                <Route path='/Register' component={Register}/>
                {/* Login Page */}
                <Route path='/Login' component={Login} />
                  <BooksProvider>
                    {/* Books List */}
                    <Route exact path='/Books' component={BoookList} />
                    {/* Books Details */}
                      {/* List of Markers */}
                    <Route exact path='/Books/:booksId' component={BookDetails} />
                    {/* Marker Details */}
                      {/* Marker Informations */}
                    <Route exact path='/Books/:booksId/:marker' component={Register} />
                  </BooksProvider>
              </Switch>
            </AuthProvider>
          </div>
        </Container>
      </Router>
    </header>
  </div>
  );
}

export default App;
