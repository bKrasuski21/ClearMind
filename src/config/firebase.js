// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMX4AfIKqGetQQ12ENSPTDZ7X9jZhfg0M",
  authDomain: "caffeineapp-b3329.firebaseapp.com",
  projectId: "caffeineapp-b3329",
  storageBucket: "caffeineapp-b3329.appspot.com",
  messagingSenderId: "277589549838",
  appId: "1:277589549838:web:31b1c68b367b45a5b3ed5f",
  measurementId: "G-ZJPW7P10TK"
};

export const signInWithGoogle = () => {
  signInWithPopup(auth, googleProvider).then((result)=> {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilepic = result.user.photoURL;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilepic", profilepic);
     
      
  }).catch((error) =>  {
      console.log(error);
  });
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider;
export const dataBase = getFirestore(app);
