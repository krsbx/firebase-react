import { useState, useEffect, useContext, createContext } from 'react';

export const BooksContext = createContext();

export function useBooks() {
  return useContext(BooksContext);
}

export function BooksProvider({children}) {
  const [currentBooks, setCurrentBooks] = useState();
  const [currentMarker, setCurrentMarker] = useState();

  const vals = {
    currentBooks,
    currentMarker,
    setCurrentBooks,
    setCurrentMarker,
  };

  return (
    <BooksContext.Provider value={vals}>
      {children}
    </BooksContext.Provider>
  )
}