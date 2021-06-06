import Login from './Login/Login';
import Register from './Register/Register';
import BookList from './Book/BookList';
import BookDetails from './Book/ListMarker';
import AddMarker from './Marker/AddMarker';
import EditMarker from './Marker/EditMarker';
import EditStore from './Store/EditStore';
import AddBooks from './NewEntry/AddBooks';
import AddStore from './NewEntry/AddStore';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import { BooksProvider } from './Context/BooksContext';
import { NewProvider } from './Context/NewContext';

export default function Homepage() {

  const { currentUser } = useAuth();
  const history = useHistory();

  const Dashboard = () => {
    if (currentUser) {
      return <BookList />;
    }
    return history.push(`/Login`);
  }

  const RoutePage = () => {
    if (!currentUser) {
      return history.push(`/Login`);
    }

    return (
      <>
      {/* Books List */}
      <Route exact path='/Books' component={ BookList } />
      {/* Books Details */}
        {/* List of Markers */}
      <Route exact path='/Books/:booksId' component={ BookDetails } />
      {/* Add Marker */}
      <Route exact path='/Marker/:booksId' component={ AddMarker } />
      {/* Marker Details */}
        {/* Marker Informations */}
      <Route exact path='/Books/:booksId/:markerId' component={ EditMarker } />
      {/* Store Details */}
      <Route exact path='/Store/:booksId' component={ EditStore } />
      {/* New Entry */}
      <NewProvider>
        {/* New Books | New Store | New Marker */}
        <Route exact path='/New' component={ AddBooks } />
        <Route exact path='/New/Store' component={ AddStore } />
      </NewProvider>
      </>
    );
  }

  return (
    <div>
      <Switch>
        {/* Determine the upload locations */}
        {/*   Normal | Vuforia Only */}
        <BooksProvider>
          {/* Dashboard = Books List */}
          <Route exact path='/'>{ Dashboard() }</Route>
          {/* Register Page */}
          <Route path='/Register' component={ Register }/>
          {/* Login Page */}
          <Route path='/Login' component={ Login } />
          {/* Router Path */}
          { RoutePage() }
        </BooksProvider>
      </Switch>
    </div>
  )
}
