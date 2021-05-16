import { useState, useEffect, useContext, createContext } from 'react';
import { database } from '../Firebase/FirebaseSDK';

export const EntryContext = createContext();

export function useEntry () {
  return useContext(EntryContext);
}

export function NewProvider( {children} ) {
  const [BookName, setBookName] = useState('');
  const [Author, setAuthor] = useState('');
  const [Model, setModel] = useState('');
  const [Size, setSize] = useState('');
  const [Cover, setCover] = useState('');
  const [Publisher, setPublisher] = useState('');
  const [Markers, setMarkers] = useState('');
  const [Store1, setStore1] = useState('');
  const [Store2, setStore2] = useState('');
  const [Store3, setStore3] = useState('');
  const [Synopsis, setSynopsis] = useState('');
  const [report, setReport] = useState('');
  const [requesting, setRequest] = useState(false);
  const [numEnt, setNumEnt] = useState();

  const GetEntry = () => {
    database.ref('Books').on('value', snapshot => {
      setNumEnt(snapshot.numChildren()+1);
    });
  }

  useEffect(() => {
    GetEntry();
  }, []);

  const PostBooksStore = async (event) => {
    event.preventDefault();

    setReport('');
    setRequest(true);

    //Post To Books Sections
    await database.ref('Books').child(BookName).update({
      Author: Author,
      BookName: BookName,
      Cover: Cover,
      Entry: numEnt,
      Publisher: Publisher,
    });

    //Post To Manager Sections
    await database.ref('Manager').child(BookName).child(Markers).update({
      Name: Markers,
    });

    //Post To Marker Sections
    await database.ref(`Marker`).child(`${BookName}<bookPlat>${Markers}`).update({
      Author: Author,
      Cover: Cover,
      Marker: Markers,
      Model: Model,
      Name: BookName,
      Publisher: Publisher,
      Size: Size,
      Synopsis: Synopsis,
    });

    //Post To Store Sections
    await database.ref('Store').child(BookName).update({
      Store1: Store1,
      Store2: Store2,
      Store3: Store3,
      Synopsis: Synopsis,
    });

    setReport('Data Updated Successfully!');
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
    Store1, setStore1,
    Store2, setStore2,
    Store3, setStore3,
    Synopsis, setSynopsis,
    report, setReport,
    requesting, setRequest,
    PostBooksStore
  }
  
  return (
    <EntryContext.Provider value={vals}>
      { children }
    </EntryContext.Provider>
  )
}
