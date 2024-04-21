import React, { useState } from 'react';
import './TriggerTracker.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';
import 'firebase/firestore'
import { dataBase } from '../config/firebase';  // Ensure you have the correct path to your Firebase config
import { collection, addDoc } from 'firebase/firestore';
import { format, startOfToday, add, endOfMonth, startOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, getDaysInMonth, getDaysInYear, isLeapYear } from 'date-fns';
import { auth, googleProvider,  } from '../config/firebase';

function TriggerTrackerForm() {
    
    const [user, loading, error] = useAuthState(auth);

    const navigate = useNavigate();
    const location = useLocation();  // Get the location object

    const date = location.state?.date;  // Access the date from the location state
    const docRef = doc(dataBase, 'triggers', user.uid);
    const docTemp = doc(dataBase, 'triggers', user.uid, 'userTriggers', date)
    //console.log("hi",docTemp)

    //const docRef = dataBase.collection('triggers').doc(user.uid).collection('userTriggers').doc(date);

    //const docRef = addDoc(dataBase, 'triggers', user.uid).collection('userTriggers').doc(date);
    const [triggers, setTriggers] = useState({
        migraine: '',
        stress: '',
        oversleeping: '',
        "sleep deprivation": '',
        exercise: '',
        fatigue: '',
        weather: '',
        anxiety: '',
        "excess light": '',
        "excess noise": '',
        "inadequate light": '',
        "specific odor": '',
        "excess drinking": '',
        "irregular eating": '',
        "excess caffeinated beverage": '',
        "excess smoking": '',
        chocolate: '',
        cheese: '',
        travel: '',
        date: date,

    });

    const placeholders = {
        migraine: 'Scale 0-10',
        stress: 'Excess stress?',
        oversleeping: 'True/False',
        "sleep deprivation": 'True/False',
        exercise: 'True/False',
        fatigue: 'True/False',
        weather: 'True/False',
        anxiety: 'True/False',
        "excess light": 'True/False',
        "excess noise": 'True/False',
        "inadequate light": 'True/False',
        "specific odor": 'True/False',
        "excess drinking": 'True/False',
        "irregular eating": 'True/False',
        "excess caffeinated beverage": 'True/False',
        "excess smoking": 'True/False',
        chocolate: 'True/False',
        cheese: 'True/False',
        travel: 'True/False',
        date: date,

    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTriggers(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent the default form submission behavior
        
        try {
            
            await setDoc(docTemp, {TriggerData: triggers})
           
            navigate('/app');  // Navigate back to the app or to a confirmation page
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    
    return (
        <>
        <h1 className="Header">
            Please answer 1 for True and 0 for False
        </h1>
        <div>
        <form onSubmit={handleSubmit} className="info-form">
            {Object.keys(triggers).map(key => (
                <div key={key} className="form-row">
                    <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    <input
                        type="text"
                        id={key}
                        name={key}
                        value={triggers[key]}
                        onChange={handleChange}
                        placeholder={placeholders[key]}
                    />
                </div>
            ))}
            <button type="submit" onClick={handleSubmit}>Submit</button>
        </form>    
        </div>
        
        </>
    );
}

export default TriggerTrackerForm;
