import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router, Route, Routes
} from "react-router-dom";
import 'firebase/auth'; 
import {ClearMind} from "./pages/index.jsx";
import {Login} from "./pages/login.js";
import {SignUp} from "./pages/SignUp.js";
import TriggerTrackerForm from './components/TriggerTracker.js';
import { Navbar } from './pages/Navbar.js';



function App() {
  return (
    
      <Router>
        <Navbar/>
        <div className = "page-container"> {}
          <Routes>
          <Route className = "form-container" path ="/form" exact element = {<TriggerTrackerForm/>}/>
          <Route path="/app" element={<ClearMind/>}/>
          <Route path="/login" element = {<Login/>}/>
          <Route path ="/Sign-up" element = {<SignUp/>}/>
        </Routes>
        </div>
      </Router>
    
  )
}


 

export default App;
