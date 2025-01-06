import React, { useState, useEffect } from 'react'; // Import useState
import { auth, googleProvider } from './config/firebase';
import './App.css';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  BrowserRouter as Router, Route, Routes
} from "react-router-dom";

import { clear } from '@testing-library/user-event/dist/clear';
import { Auth } from './components/auth.jsx';
import { dataBase } from './config/firebase'; // data from fire base 
import { getDocs } from 'firebase/firestore';
import { getDoc, collection, addDoc } from 'firebase/firestore';
import 'firebase/auth'; 
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import { DateTimeDisplay } from './components/dateDisplay';
import {addDays, subDays} from "date-fns"

import {CafApp, EventCalendar} from "./pages/index.jsx";
import TriggerTrackerForm from './components/TriggerTracker.js';
//import { LoginAuth } from './components/login';



function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Auth/>}/>
          <Route className = "form-container" path ="/form" exact element = {<TriggerTrackerForm/>}/>
          <Route path="/app" element={<CafApp/>}/>
        </Routes>
      </Router>
    </div>
  )
}


 

export default App;
