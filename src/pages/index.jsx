import React, { useState, useEffect } from 'react';
import { format, startOfToday, add, endOfMonth, startOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, getDaysInMonth, getDaysInYear, isLeapYear } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { auth, googleProvider,  } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { dataBase } from '../config/firebase'; // data from fire base 
import { deleteDoc } from 'firebase/firestore';
import { doc, getDoc, collection, addDoc, updateDoc, setDoc } from 'firebase/firestore';
import 'firebase/auth'; 
import {useAuthState} from 'react-firebase-hooks/auth';
import './index.css';

    
export const ClearMind = () => {
  const [chronicMigraines, setChronicMigraines] = useState(false);

  const [isRemovingMode, setIsRemovingMode] = useState(false);

  const remove = () => {
    if(isRemovingMode){
      setIsRemovingMode(false);
  }else {
    setIsRemovingMode(true);
  }
  }
  const [user, loading, error] = useAuthState(auth); // Get the authenticated user

  const migraineDataRef = collection(dataBase, "MigraineData"); // passed in database and the collection we are trying to access. caffeineDatabaseRef -> reference to our UserData collection
  const [databaseData, setdatabaseData] = useState([]);
 
  const [migraineDays, setMigraineDays] = useState({});
  const navigate = useNavigate();
  const [showDetailForm, setShowDetailForm] = useState(false);
  //setShowDetailForm(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  useEffect(() => {
    handleAverages();
  }, [currentMonth]);

  const [notes, setNotes] = useState({}); // State to store notes for each day

  const startDay = startOfMonth(currentMonth);
  const endDay = endOfMonth(currentMonth);

  const days = eachDayOfInterval({
    start: startDay.getDay() === 0 ? startDay : add(startDay, { days: -startDay.getDay() }),
    end: endDay,
  });

  const previousMonth = () => {
    const newMonth = add(currentMonth, { months: -1 });
    setCurrentMonth(newMonth);
    handleAverages(newMonth);
  };
  
  const nextMonth = () => {
    const newMonth = add(currentMonth, { months: 1 });
    setCurrentMonth(newMonth);
    handleAverages(newMonth);
  };

  useEffect(() => {
    if (user) {
      const userDocRef = doc(dataBase, 'MigraineData', user.uid);

      const fetchUserData = async () => {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setMigraineDays(data.Days || {});
          setNotes(data.Notes || {});
        } else {
          // Document does not exist, initialize with empty data
          await setDoc(userDocRef, { Days: {}, Notes: {} });
        }
      };

      fetchUserData();
    }
  }, [user]);


  const handleDayClick = async (day) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    const hasMigraine = migraineDays[formattedDate];
    if (!user) {
      if(!isRemovingMode){
        const note = hasMigraine ? prompt('Edit your migraine note:', notes[formattedDate] || '') : prompt('Migraine Severity 1-10:', '');
        const hasNote = note !== null && note.trim() !== '';
          if (hasNote) {
            // Update local states
            const newMigraineDays = { ...migraineDays, [formattedDate]: true };
            const newNotes = { ...notes, [formattedDate]: note.trim() };
            setMigraineDays(newMigraineDays);
            setNotes(newNotes);

            // Update Firestore
            const calendarDataRef = doc(dataBase, 'MigraineData', 'CalendarData');
            await updateDoc(calendarDataRef, {
              Days: newMigraineDays,
              Notes: newNotes
            });
          } else if (hasMigraine) {
            // Remove the note and update Firestore if the user cancels the edit
            const newMigraineDays = { ...migraineDays, [formattedDate]: false };
            const newNotes = { ...notes };
            delete newNotes[formattedDate];
            setMigraineDays(newMigraineDays);
            setNotes(newNotes);

            const calendarDataRef = doc(dataBase, 'MigraineData', 'CalendarData');
            await updateDoc(calendarDataRef, {
              Days: newMigraineDays,
              Notes: newNotes
            });
          }
          
        }
        if (isRemovingMode) {
          const newMigraineDays = { ...migraineDays };
          const newNotes = { ...notes };
          delete newMigraineDays[formattedDate]; // Or set to false depending on your data structure
          delete newNotes[formattedDate];
      
          setMigraineDays(newMigraineDays);
          setNotes(newNotes);
      
          // Update Firestore
          const calendarDataRef = doc(dataBase, 'MigraineData', 'CalendarData');
          await updateDoc(calendarDataRef, {
            Days: newMigraineDays,
            Notes: newNotes
          });
        }
    }else {
      if(!isRemovingMode){
    const note = hasMigraine ? prompt('Edit your migraine note:', notes[formattedDate] || '') : prompt('Migraine Severity 0-10:', '');
    const hasNote = note !== null && note.trim() !== '';
      if (hasNote) {
        // Update local states
        const newMigraineDays = { ...migraineDays, [formattedDate]: true };
        const newNotes = { ...notes, [formattedDate]: note.trim() };
        setMigraineDays(newMigraineDays);
        setNotes(newNotes);
      
        // Update Firestore
        const calendarDataRef = doc(dataBase, 'MigraineData', user.uid);
        await updateDoc(calendarDataRef, {
          Days: newMigraineDays,
          Notes: newNotes
        });
      } else if (hasMigraine) {
        // Remove the note and update Firestore if the user cancels the edit
        const newMigraineDays = { ...migraineDays, [formattedDate]: false };
        const newNotes = { ...notes };
        delete newNotes[formattedDate];
        setMigraineDays(newMigraineDays);
        setNotes(newNotes);

        const calendarDataRef = doc(dataBase, 'MigraineData', user.uid);
        await updateDoc(calendarDataRef, {
          Days: newMigraineDays,
          Notes: newNotes
        });
      }
      console.log("WHAT IS GOING ON")
      //setShowDetailForm(true)
      navigate('/form', { state: { date: formattedDate} })    
    }
    if (isRemovingMode) {
      const newMigraineDays = { ...migraineDays };
      const newNotes = { ...notes };
      delete newMigraineDays[formattedDate]; // Or set to false depending on your data structure
      delete newNotes[formattedDate];
  
      setMigraineDays(newMigraineDays);
      setNotes(newNotes);

      // Update Firestore
      const calendarDataRef = doc(dataBase, 'MigraineData', user.uid);
      await updateDoc(calendarDataRef, {
        Days: newMigraineDays,
        Notes: newNotes
      });
      const docTemp = doc(dataBase, 'triggers', user.uid, 'userTriggers', formattedDate)
        try {
          await deleteDoc(docTemp);
          console.log("Document successfully deleted!");
        } catch (error) {
          console.error("Error removing document: ", error);
        }
      
    }
    }
    
  };

  const HandleLogOff = async () => {
    try {
      await signOut(auth);
      navigate('/');
    }catch (err){
      console.log(err);
    }
    
  }
  
  const daysInYear = isLeapYear(currentMonth) ? 366 : 365;
  const daysInMonth = getDaysInMonth(currentMonth);

  // State hooks for averages
  const [yearlyAverage, setYearlyAverage] = useState(0);
  const [monthlyAverage, setMonthlyAverage] = useState(0);

  // Function to handle averages
  const handleAverages = () => {
    const currentMonthStr = format(currentMonth, 'yyyy-MM');
  
    const monthlyMigraineDays = Object.keys(migraineDays).filter(date => 
      date.startsWith(currentMonthStr) && migraineDays[date]
    );
      
  
    const monthlyCount = monthlyMigraineDays.length;
    const monthlyAverage = monthlyCount / daysInMonth;
  
    // If you want to keep a running total for the year as well
    const yearlyCount = Object.values(migraineDays).filter(day => day).length;

    const yearlyAverage = yearlyCount / daysInYear;
      if(monthlyAverage >= 0.49 ){
        setChronicMigraines(true);
      }else if(monthlyAverage > 0){
        setChronicMigraines(false);
      }
    setYearlyAverage(yearlyAverage);
    setMonthlyAverage(monthlyAverage);
  };

  useEffect(() => {
    handleAverages();
  }, [migraineDays, currentMonth]);

  const calculateColor = (value) => {
    const green = [0, 128, 0]; // RGB for green
    const red = [255, 0, 0]; // RGB for red
    // Calculate the RGB values by interpolating between green and red
    const color = green.map((c, i) => c + Math.round((red[i] - c) * 2*value));
    return `rgb(${color.join(',')})`;
  };
  const calculateMigraineColor = (value) => {
    //const green = [0, 128, 0]; // RGB for green
    //const color = [255, 255 , 255]
    //const color = [25 * value, 255 , 255]
    const color = [200, Math.max(0, 255 - 30 * value), Math.max(0, 255 - 30 * value)];
    return `rgb(${color.join(',')})`;
  };
  
  return (
    <>     
    <div>
    <div className="top">
    
  </div>
 
      <div className="header">
        <button onClick={previousMonth} className="navigation-button"><ChevronLeftIcon className="w-6 h-6" /></button>
        <span className="month-title" style={{ color: calculateColor(monthlyAverage) }}>{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={nextMonth} className="navigation-button"><ChevronRightIcon className="w-6 h-6" /></button>
      </div>
      <div className="weekdays-header">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName, index) => (
          <div key={index} className="day-cell header">{dayName}</div>
        ))}
      </div>
      <div className="grid-container" >
        {days.map((day, index) => {
          const formattedDate = format(day, 'yyyy-MM-dd');
          const isCurrentDay = isToday(day);
          const noteValue = parseInt(notes[formattedDate], 10); // Assuming notes are stored as "Migraine Severity 1-10"
          const dayColor = noteValue ? calculateMigraineColor(noteValue) : 'transparent'; // Default to transparent if no note
          return (
            <>
            <div
              key={index}
              className={`day-cell ${isSameMonth(day, startDay) ? '' : 'not-in-month'} ${notes[formattedDate] ? 'selected' : ''}`}
              onClick={() => handleDayClick(day)}
              style={{
                backgroundColor: `white`,
                backgroundColor: notes[formattedDate] ? dayColor : '',
                //border: notes[formattedDate] ? '1px solid black' : ''
              }}
            >
              {format(day, 'd')}
              {notes[formattedDate] && <div className="note">{notes[formattedDate]}</div>}
            </div>
           
          
            </>
          );
        })}
        
      </div>
    </div>
    <div className='container'>
 
  <button
    onClick={() => setIsRemovingMode(!isRemovingMode)}
    className={isRemovingMode ? 'button-remove-mode' : 'button-normal-mode'}
  >
    {isRemovingMode ? "Disable Removing Mode" : "Remove Migraine"}
  </button>
</div>

    </>
  );
}; 