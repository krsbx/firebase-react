import Login from './Login/Login';
import Register from './Register/Register';
import BoookList from './Book/BookList';
import BookDetails from './Book/ListMarker';
import AddMarker from './Marker/AddMarker';
import EditMarker from './Marker/EditMarker';
import EditStore from './Store/EditStore';
import { Switch, Route } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';

export default function Homepage() {

  const { currentUser } = useAuth();

  const Dashboard = () => {
    if(currentUser){
      return <BoookList />;
    }
    return <Login />;
  }

  return (
    <div>
      <Switch>
        {/* Dashboard = Books List */}
        <Route exact path='/' component={Dashboard} />
        {/* Register Page */}
        <Route path='/Register' component={Register}/>
        {/* Login Page */}
        <Route path='/Login' component={Login} />
        {/* Books List */}
        <Route exact path='/Books' component={BoookList} />
        {/* Books Details */}
          {/* List of Markers */}
        <Route exact path='/Books/:booksId' component={BookDetails} />
        {/* Add Marker */}
        <Route exact path='/Marker/:booksId' component={AddMarker} />
        {/* Marker Details */}
          {/* Marker Informations */}
        <Route exact path='/Books/:booksId/:markerId' component={EditMarker} />
        {/* Store Details */}
        <Route exact path='/Store/:booksId' component={EditStore} />
      </Switch>
    </div>
  )
}
