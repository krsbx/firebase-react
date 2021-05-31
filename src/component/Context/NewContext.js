import { useState, useEffect, useContext, createContext } from 'react';
import { database, timestamp } from '../Firebase/FirebaseSDK';
import { target, getMarker64 } from '../Vuforia/VWSHandler';
import { addTarget } from '../Vuforia/VWS_Request';
import { useHistory } from 'react-router-dom';
import { useBooks } from './BooksContext';

export const EntryContext = createContext();

export function useEntry () {
  return useContext(EntryContext);
}

export function NewProvider( { children } ) {
  const [BookName, setBookName] = useState('');
  const [Author, setAuthor] = useState('');
  const [Model, setModel] = useState('');
  const [Size, setSize] = useState('');
  const [Cover, setCover] = useState('');
  const [Publisher, setPublisher] = useState('');
  const [Markers, setMarkers] = useState('');
  const [MarkerImage, setMarkerImage] = useState({});
  const [Store1, setStore1] = useState('');
  const [Store2, setStore2] = useState('');
  const [Store3, setStore3] = useState('');
  const [Synopsis, setSynopsis] = useState('');
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [requesting, setRequest] = useState(false);
  const [numEnt, setNumEnt] = useState();
  const history = useHistory();

  const { currentMode } = useBooks();

  const GetEntry = () => {
    database.ref(`${currentMode}Books`).on('value', snapshot => {
      setNumEnt(snapshot.numChildren()+1);
    });
  }

  useEffect(() => {
    GetEntry();
  }, []);

  const PostBooksStore = async (event) => {
    event.preventDefault();

    setReport('');
    setError('');
    setRequest(true);

    let existed = false;

    database.ref(`${currentMode}Books`).child(`${BookName}<bookPlat>${Author}`).on('value', snapshot => {
      if(snapshot.exists()){
        setError('Books Already Exist!');
        setRequest(false);
        existed = true;
        return;
      }
    });

    if (existed === true) {
      return;
    }

    database.ref(`${currentMode}Books`).child(`${BookName}<bookPlat>${Author}`).off('value');

    const Metadata = {
      Author: Author,
      Cover: Cover,
      Marker: Markers,
      Model: Model,
      Name: BookName,
      Publisher: Publisher,
      Size: Size,
      Synopsis: Synopsis,
    };

    const images64 = await getMarker64(MarkerImage);

    const data = target(`${BookName}<bookPlat>${Author}<bookPlat>${Markers}`, Metadata, images64);

    const request = await addTarget(data);

    try {
      if (request.data['result_code'] === 'TargetCreated'){

        const bookPath = `${BookName}<bookPlat>${Author}`;

        //Post To Books Sections
        await database.ref(`${currentMode}Books`).child(bookPath).update({
          Author: Author,
          BookName: BookName,
          Cover: Cover,
          Entry: numEnt,
          Publisher: Publisher,
        });

        //Post To Cloud Reco Sections
        await database.ref(`${currentMode}Cloud Reco`).child(`${bookPath}<bookPlat>${Markers}`).update({
          UID: request.data['target_id'],
        });

        //Post To Manager Sections
        await database.ref(`${currentMode}Manager`).child(bookPath).child(Markers).update({
          Name: Markers,
          createdAt: timestamp,
          updatedAt: timestamp,
        });

        //Post To Marker Sections
        await database.ref(`${currentMode}Marker`).child(`${BookName}<bookPlat>${Author}<bookPlat>${Markers}`).update(Metadata);

        //Post To Store Sections
        await database.ref(`${currentMode}Store`).child(bookPath).update({
          Store1: Store1,
          Store2: Store2,
          Store3: Store3,
          Synopsis: Synopsis,
        });

        setReport('Data Updated Successfully!');

        setTimeout(3000);

        history.push(`/Books/`);

      } else {
        setError(request.data['result_code']);
      }
    } catch {
      setError('Bad Request!');
    }

    setRequest(false);
  }

  const vals = {
    BookName, setBookName,
    Author, setAuthor,
    Model, setModel,
    Size, setSize,
    Cover, setCover,
    Publisher, setPublisher,
    Markers, setMarkers,
    MarkerImage, setMarkerImage,
    Store1, setStore1,
    Store2, setStore2,
    Store3, setStore3,
    Synopsis, setSynopsis,
    report, setReport,
    error, setError,
    requesting, setRequest,
    PostBooksStore,
  }
  
  return (
    <EntryContext.Provider value={ vals }>
      { children }
    </EntryContext.Provider>
  )
}
