import { AuthProvider } from './component/Context/AuthContext';
import { BooksProvider } from './component/Context/BooksContext';
import Homepage from './component/Homepage';
import { BrowserRouter as Router } from 'react-router-dom';
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
              <BooksProvider>
                <Homepage />
              </BooksProvider>
            </AuthProvider>
          </div>
        </Container>
      </Router>
    </header>
  </div>
  );
}

export default App;
