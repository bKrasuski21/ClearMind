import React, { useState } from 'react';
import './TriggerTracker.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { dataBase } from '../config/firebase';  // Ensure you have the correct path to your Firebase config
import { collection, addDoc } from 'firebase/firestore';
import { format, startOfToday, add, endOfMonth, startOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, getDaysInMonth, getDaysInYear, isLeapYear } from 'date-fns';

function TriggerTrackerForm() {
    const navigate = useNavigate();
    const location = useLocation();  // Get the location object

    const date = location.state?.date;  // Access the date from the location state

    const [triggers, setTriggers] = useState({
        migraine: '',
        sleep: '',
        food: '',
        water: '',
        exercise: '',
        stress: '',
        anxiety: '',
        depression: '',
        caffeine: '',
        alcohol: '',
        nicotine: '',
        smell: '',
        date: date,

    });

    const placeholders = {
        migraine: 'Scale 0-10',
        sleep: 'Hours of sleep (e.g 8)',
        food: 'Did you eat out?',
        water: 'Number of cups',
        exercise: 'Minutes of exercise',
        stress: 'Scale 1-10',
        anxiety: 'Scale 1-10',
        depression: 'Scale 1-10',
        caffeine: 'In MG',
        alcohol: 'In number of shots',
        nicotine: 'Yes / No ',
        smell: 'Did you go to sephora?'

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
            // Adding the triggers data to Firestore
            const docRef = await addDoc(collection(dataBase, "triggers"), triggers);
            console.log("Document written with ID: ", docRef.id);
            navigate('/app');  // Navigate back to the app or to a confirmation page
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    
    return (
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
    );
}

export default TriggerTrackerForm;
