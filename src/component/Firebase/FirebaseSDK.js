import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA9I0kddPRgthC7YMY4dCor7TjznRQzrLo",
  authDomain: "aristotell-book-platforms.firebaseapp.com",
  databaseURL: "https://aristotell-book-platforms-default-rtdb.firebaseio.com",
  projectId: "aristotell-book-platforms",
  storageBucket: "aristotell-book-platforms.appspot.com",
  messagingSenderId: "466989169035",
  appId: "1:466989169035:web:a4300927ac6f3aee2a178e",
  measurementId: "G-S693FWB9XW"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const database = app.database();
export default app;