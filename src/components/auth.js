import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import Button from 'react-bootstrap/Button';


export const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const auth = firebase.auth();
    const [user] = useAuthState(auth);

    console.log(auth?.currentUser?.email);

    return (
        <div>   
         
         {user ? <LogOff /> : <SignIn />} 
         
        </div>
    );
};
function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    
    const signIn = async() => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        }catch (err){
            console.log(err);
        }
    };

    console.log(auth?.currentUser?.email);

    const signInWithGoogle = async() => {
        try {
            await signInWithPopup(auth, googleProvider);
        }catch(err){
            console.log(err);
        }
    };
    return (
        <>
         <input placeholder="Email..." onChange={(e) => setEmail(e.target.value)}/>
            <input placeholder="Password..." 
            type= "password"
            onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={signIn}>Sign In</button>
           
           <button onClick={signInWithGoogle}> Sign in With Google</button>
        </>
    
    )
}
function LogOff(){
    const logOut = async () => {
        try {
            await signOut(auth);
        }catch(err){
            console.log(err);
        }
    }
    return(
        <>
             <button onClick={logOut}> Logout</button>
        </>
    )
}