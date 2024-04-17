import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
//import { InputGroup } from 'react-bootstrap';
import './loginSection.css';
import  TriggerTrackerForm  from './TriggerTracker.js'


export const LogOffApp = () => {
    
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    //signOut(auth);
    if(user){
       navigate('/app'); 
    }else {
        navigate('/');
    }
    
}
export const Auth = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const auth = firebase.auth();
    const [user] = useAuthState(auth);

    console.log(auth?.currentUser?.email);
        if(user){
            navigate('/app');
        }
    return (
        <>  
          <div className = "loginContainer">   
            {user ? <LogOff /> : <SignIn />}
             </div>
        </>
                        
                
    );
};
function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    
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
    const ContinueGuest = async() => {
        navigate('/app');
    }
    return (
        <>
        <div className="title">
            ClearMind
        </div>
        <div className="buttonTopContainer">
             <input className = "loginInput" placeholder="Email..." onChange={(e) => setEmail(e.target.value)}/>
            <input className = "loginInput" placeholder="Password..." 
            type= "password"
            onChange={(e) => setPassword(e.target.value)}/>
            <Button className="loginButton" onClick={signIn}>Sign In</Button>
            <Button className="loginButton" onClick={ContinueGuest}>Continue As Guest</Button>

           <Button className="loginButtonGoogle" onClick={signInWithGoogle}> Sign in With Google</Button>
        </div>
        
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
             <Button className="loginButton" onClick={logOut}> Logout</Button>
        </>
    )
}