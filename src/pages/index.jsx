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
  const [user] = useAuthState(auth);
  const [migraineDays, setMigraineDays] = useState({});
  const [notes, setNotes] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expandedDay, setExpandedDay] = useState(null); // Track expanded day
  const startDay = startOfMonth(currentMonth);
  const endDay = endOfMonth(currentMonth);
  const days = eachDayOfInterval({
    start: startDay,
    end: endDay,
  });

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
          await setDoc(userDocRef, { Days: {}, Notes: {} });
        }
      };

      fetchUserData();
    }
  }, [user]);

  const handleDayClick = async (day) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    const note = prompt('Migraine Severity 0-10:', '');
    const hasNote = note !== null && note.trim() !== '';
    if (hasNote) {
      const newMigraineDays = { ...migraineDays, [formattedDate]: true };
      const newNotes = { ...notes, [formattedDate]: note.trim() };
      setMigraineDays(newMigraineDays);
      setNotes(newNotes);

      const calendarDataRef = doc(dataBase, 'MigraineData', user.uid);
      await updateDoc(calendarDataRef, {
        Days: newMigraineDays,
        Notes: newNotes,
      });
    }
  };

  const showHidden = (day) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    setExpandedDay(formattedDate === expandedDay ? null : formattedDate); // Toggle expanded state
  };

  const handleEdit = (formattedDate) => {
    const newNote = prompt('Edit your migraine note:', notes[formattedDate] || '');
    if (newNote !== null && newNote.trim() !== '') {
      const newNotes = { ...notes, [formattedDate]: newNote.trim() };
      setNotes(newNotes);

      const calendarDataRef = doc(dataBase, 'MigraineData', user.uid);
      updateDoc(calendarDataRef, { Notes: newNotes });
    }
  };

  const handleRemove = (formattedDate) => {
    const newMigraineDays = { ...migraineDays };
    const newNotes = { ...notes };
    delete newMigraineDays[formattedDate];
    delete newNotes[formattedDate];
    setMigraineDays(newMigraineDays);
    setNotes(newNotes);

    const calendarDataRef = doc(dataBase, 'MigraineData', user.uid);
    updateDoc(calendarDataRef, { Days: newMigraineDays, Notes: newNotes });
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={() => setCurrentMonth(add(currentMonth, { months: -1 }))} className="navigation-button">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <span className="month-title">{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={() => setCurrentMonth(add(currentMonth, { months: 1 }))} className="navigation-button">
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="grid-container">
        {days.map((day, index) => {
          const formattedDate = format(day, 'yyyy-MM-dd');
          const isExpanded = expandedDay === formattedDate;

          return (
            <div
              key={index}
              className={`day-cell ${isToday(day) ? 'today' : ''}`}
              onClick={() => showHidden(day)}
              style={{
                backgroundColor: migraineDays[formattedDate] ? 'lightcoral' : 'transparent',
              }}
            >
              {!isExpanded ? (
                <>
                  {format(day, 'd')}
                  {notes[formattedDate] && <div className="note">{notes[formattedDate]}</div>}
                </>
              ) : (
                <div className="buttons-container">
                  <button onClick={() => handleEdit(formattedDate)}>Edit Migraine</button>
                  <button onClick={() => handleRemove(formattedDate)}>Remove</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
