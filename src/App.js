import './App.css';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import { AuthProvider } from './component/Context/AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <AuthProvider>
            <Switch>
              <Route exact path='/' component={Login} />
              <Route path='/Register' component={Register} />
              <Route exact path='/Login' component={Login} />
            </Switch>
          </AuthProvider>
        </header>
      </div>
    </Router>
  );
}

export default App;
