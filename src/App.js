import React, { useState, useEffect } from 'react'; // Import useState
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router, Route, Routes
} from "react-router-dom";
import { Auth } from './components/auth.jsx';
import 'firebase/auth'; 
import {CafApp, EventCalendar} from "./pages/index.jsx";
import TriggerTrackerForm from './components/TriggerTracker.js';



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
