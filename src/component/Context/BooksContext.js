import { useState, useContext, createContext } from 'react';

export const BooksContext = createContext();

export function useBooks() {
  return useContext(BooksContext);
}

export function BooksProvider({children}) {
  const [currentMode, setCurrentMode] = useState('');

  const vals = {
    currentMode, setCurrentMode,
  };

  return (
    <BooksContext.Provider value={vals}>
      {children}
    </BooksContext.Provider>
  )
}