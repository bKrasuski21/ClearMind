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
//import { LoginAuth } from './components/login';


const availableTimes = ["12:00AM", "1:00","2:00","3:00", "4:00","5:00","6:00","7:00", "8:00","9:00", "10:00", "11:00", "12:00PM","1:00","2:00","3:00", "4:00","5:00","6:00","7:00", "8:00","9:00", "10:00", "11:00", "11:59"];
const availableAM = ["AM", "PM"];
const availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const initialData = [
  {
    name: "12:00AM",
    Caffeine: 0,
  },
  {
    name: "1:00",
    Caffeine: 0,
  },
  {
    name: "2:00",
    Caffeine: 0,
  },
  {
    name: "3:00",
    Caffeine: 0,
  },
  {
    name: "4:00",
    Caffeine: 0,
  },
  {
    name: "5:00",
    Caffeine: 0,
  },
  {
    name: "6:00",
    Caffeine: 0,
  },
  {
    name: "7:00",
    Caffeine: 0,
  },
  {
    name: "8:00",
    Caffeine: 0,
  },
  {
    name: "9:00",
    Caffeine: 0,
  },
  {
    name: "10:00",
    Caffeine: 0,
  },
  {
    name: "11:00",
    Caffeine: 0,
  },
  {
    name: "12:00PM",
    Caffeine: 0,
  },
  {
    name: "1:00",
    Caffeine: 0,
  },
  {
    name: "2:00",
    Caffeine: 0,
  },
  {
    name: "3:00",
    Caffeine: 0,
  },
  {
    name: "4:00",
    Caffeine: 0,
  },
  {
    name: "5:00",
    Caffeine: 0,
  },
  {
    name: "6:00",
    Caffeine: 0,
  },
  {
    name: "7:00",
    Caffeine: 0,
  },
  {
    name: "8:00",
    Caffeine: 0,
  },
  {
    name: "9:00",
    Caffeine: 0,
  },
  {
    name: "10:00",
    Caffeine: 0,
  },
  {
    name: "11:00",
    Caffeine: 0,
  },
  {
    name: "11:59",
    Caffeine: 0, 
  },
];
let modifiedData = [
  {
    name: "12:00AM",
    Caffeine: 0,
  },
  {
    name: "1:00",
    Caffeine: 0,
  },
  {
    name: "2:00",
    Caffeine: 0,
  },
  {
    name: "3:00",
    Caffeine: 0,
  },
  {
    name: "4:00",
    Caffeine: 0,
  },
  {
    name: "5:00",
    Caffeine: 0,
  },
  {
    name: "6:00",
    Caffeine: 0,
  },
  {
    name: "7:00",
    Caffeine: 0,
  },
  {
    name: "8:00",
    Caffeine: 0,
  },
  {
    name: "9:00",
    Caffeine: 0,
  },
  {
    name: "10:00",
    Caffeine: 0,
  },
  {
    name: "11:00",
    Caffeine: 0,
  },
  {
    name: "12:00PM",
    Caffeine: 0,
  },
  {
    name: "1:00",
    Caffeine: 0,
  },
  {
    name: "2:00",
    Caffeine: 0,
  },
  {
    name: "3:00",
    Caffeine: 0,
  },
  {
    name: "4:00",
    Caffeine: 0,
  },
  {
    name: "5:00",
    Caffeine: 0,
  },
  {
    name: "6:00",
    Caffeine: 0,
  },
  {
    name: "7:00",
    Caffeine: 0,
  },
  {
    name: "8:00",
    Caffeine: 0,
  },
  {
    name: "9:00",
    Caffeine: 0,
  },
  {
    name: "10:00",
    Caffeine: 0,
  },
  {
    name: "11:00",
    Caffeine: 0,
  },
  {
    name: "11:59",
    Caffeine: 0, 
  },
]; 

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Auth/>}/>
          
          <Route path="/app" element={<CafApp/>}/>
        </Routes>
      </Router>
    </div>
  )
}


 

export default App;
/*


  const caffeineDatabaseRef = collection(dataBase, "UserData"); // passed in database and the collection we are trying to access. caffeineDatabaseRef -> reference to our UserData collection
  const mondayCafData = collection(dataBase, "Monday"); // reference to the Monday document in UserData collection
  const [databaseData, setdatabaseData] = useState([]);
  useEffect(() => {
    
    const getdatabaseData = async() => { 
      try {
        const data = await getDocs(caffeineDatabaseRef); // get docs will get all of the docs inside this collection (i.e. UserData collection)
        //console.log(data); // data is a query snapshot i.e. unfilted, a shit load of random data
        const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id})); // accessing all docs from data(UserData), returns only doc data, and user ID
        console.log(filteredData);
        setdatabaseData(filteredData);
      }catch(err){
        console.log(err);
      }
    };
    getdatabaseData();
  }, []);
  
  const [chartData, setChartData] = useState(initialData);
  //const [weekDays, setweekDays] = useState(Array(7).fill(initialData));
  const [caffeine, setCaffeine] = useState('');
  const [time, setTime] = useState('');
  const [AMPM, setAMPM] = useState('');
  const [buttonClicked, setButtonClicked] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [MondayData, setMondayData] = useState(initialData.map(item => ({ ...item })));
  const [TuesdayData, setTuesdayData] = useState(initialData.map(item => ({ ...item })));
  const [WednesdayData, setWednesdayData] = useState(initialData.map(item => ({ ...item })));
  const [ThursdayData, setThursdayData] = useState(initialData.map(item => ({ ...item })));
  const [FridayData, setFridayData] = useState(initialData.map(item => ({ ...item })));
  const [SaturdayData, setSaturdayData] = useState(initialData.map(item => ({ ...item })));
  const [SundayData, setSundayData] = useState(initialData.map(item => ({ ...item })));

  const clearData = () => {
    let tempData = modifiedData.map(item => ({ ...item }));// creates structured array to modify data(i.e. has all the times)
    if(buttonClicked == "Monday"){

     databaseData.forEach((document) => { // for each document in the database (which is only 1 for now) 
      if (document.caffeineData && Array.isArray(document.caffeineData)) {
        console.log(document.caffeineData[5]); // document.caffeineData is an array of caffeine data
        document.caffeineData.forEach((item, index) => { // iterates through each item in the array and sets our tempData to the value of the item at the same index
          tempData[index].Caffeine = item;
        });
      }
    });
      console.log(tempData);
      setMondayData(tempData); // sets the data for the graph to the tempData
   }else if(buttonClicked == "Tuesday"){
      setTuesdayData(initialData.map(item => ({ ...item })));
   }else if(buttonClicked == "Wednesday"){
    setWednesdayData(initialData.map(item => ({ ...item })));
  }else if(buttonClicked == "Thursday"){
    setThursdayData(initialData.map(item => ({ ...item })));
  }else if(buttonClicked == "Friday"){
    setFridayData(initialData.map(item => ({ ...item })));
  }else if(buttonClicked == "Saturday"){
    setSaturdayData(initialData.map(item => ({ ...item })));
  }else if(buttonClicked == "Sunday"){
    setSundayData(initialData.map(item => ({ ...item })));
  }
   setButtonClicked("Empty Graph");
   setChartData(initialData);
   
  } 
 

  const Monday = () => {
    setChartData(MondayData);
    setButtonClicked("Monday");
  }
  const Tuesday = () => {
    setChartData(TuesdayData);
    setButtonClicked("Tuesday");

  }
  const Wednesday = () => {
    setChartData(WednesdayData);
    setButtonClicked("Wednesday");

  }
  const Thursday = () => {
    setChartData(ThursdayData);
    setButtonClicked("Thursday");

  }
  const Friday = () => {
    setChartData(FridayData);
    setButtonClicked("Friday");

  }
  const Saturday = () => {
    setChartData(SaturdayData);
    setButtonClicked("Saturday");

  }
  const Sunday = () => {
    setChartData(SundayData);
    setButtonClicked("Sunday");

  }
  const AddCaffeineToCurrentTime = () => {
// add time 


  }
  const handleSubmit = async () => {
    let newData = modifiedData.map(item => ({ ...item }));
    let startIndex = 0;
    //let newData = initialData.slice();
    if(dayOfWeek == "Monday"){
       newData = MondayData.slice();
    }else if(dayOfWeek == "Tuesday"){
       newData = TuesdayData.slice();
    }else if(dayOfWeek == "Wednesday"){
       newData = WednesdayData.slice();
    }else if(dayOfWeek == "Thursday"){
       newData = ThursdayData.slice();
    }else if(dayOfWeek == "Friday"){
       newData = FridayData.slice();
    }else if(dayOfWeek == "Saturday"){
       newData = SaturdayData.slice();
    }else if(dayOfWeek == "Sunday"){
       newData = SundayData.slice();
    }

  if(AMPM == "AM"){
    for (let i = 0; i < newData.length; i++) {
      if(newData[i].name == time){
        startIndex = i;
        break;
      }
    } 
  }else if(AMPM == "PM"){
    for (let i = (newData.length -1); i > 0; i--) {
      if(newData[i].name == time){
        startIndex = i;
        break;
      }
    }
  }

  let caffeineAmount = parseInt(caffeine, 10);
  newData[startIndex].Caffeine += caffeineAmount;


  for(let i = (startIndex + 1); i < newData.length; i++){
      caffeineAmount*=0.88;
      newData[i].Caffeine += caffeineAmount;
  }

    if(dayOfWeek == "Monday"){
      setButtonClicked("Monday");

      TuesdayData[0].Caffeine = newData[24].Caffeine;
      let newCaf = TuesdayData[0].Caffeine;
      let newIndex = 0;
      for (let i = 1; i < TuesdayData.length; i++) {
        let currentIndex = (newIndex + i) % newData.length;
          newCaf *= 0.88; // 88% of previous hour's value
          TuesdayData[i].Caffeine = newCaf;
        }
      
        await addDoc(caffeineDatabaseRef, { // adds a new document to the database
          caffeineData: MondayData.map((item) => item.Caffeine), // adds the caffeine data to the database
        });
    }else if(dayOfWeek == "Tuesday"){
      setButtonClicked("Tuesday");

      WednesdayData[0].Caffeine = TuesdayData[24].Caffeine;
      let newCaf = WednesdayData[0].Caffeine;
      for (let i = 1; i < WednesdayData.length; i++) {
          newCaf *= 0.88; // 88% of previous hour's value
          WednesdayData[i].Caffeine = newCaf;
        }
    }else if(dayOfWeek == "Wednesday"){
      setButtonClicked("Wednesday");

      ThursdayData[0].Caffeine = WednesdayData[24].Caffeine;
      let newCaf = ThursdayData[0].Caffeine;
      for (let i = 1; i < ThursdayData.length; i++) {
          newCaf *= 0.88; // 88% of previous hour's value
          ThursdayData[i].Caffeine = newCaf;
        }
      
    }else if(dayOfWeek == "Thursday"){
      setButtonClicked("Thursday");

      FridayData[0].Caffeine = ThursdayData[24].Caffeine;
      let newCaf = FridayData[0].Caffeine;
      for (let i = 1; i < FridayData.length; i++) {
          newCaf *= 0.88; // 88% of previous hour's value
          FridayData[i].Caffeine = newCaf;
        }
      
      
    }else if(dayOfWeek == "Friday"){
      setButtonClicked("Friday");

      SaturdayData[0].Caffeine = FridayData[24].Caffeine;
      let newCaf = SaturdayData[0].Caffeine;
      for (let i = 1; i < SaturdayData.length; i++) {
          newCaf *= 0.88; // 88% of previous hour's value
          SaturdayData[i].Caffeine = newCaf;
        }
      
      
    }else if(dayOfWeek == "Saturday"){
      setButtonClicked("Saturday");

      SundayData[0].Caffeine = SaturdayData[24].Caffeine;
      let newCaf = SundayData[0].Caffeine;
      for (let i = 1; i < SundayData.length; i++) {
          newCaf *= 0.88; // 88% of previous hour's value
          SundayData[i].Caffeine = newCaf;
        }
      
      
    }else if(dayOfWeek == "Sunday"){
      setButtonClicked("Sunday");
    }
    setChartData(newData);
  };
  //const [user] = useAuthState(Auth);
 // console.log(user);

  return (
    <>
      <div className="App">
       
        <h1>Blood Caffeine Level</h1>
        

        
       <DateTimeDisplay/>
        <Auth/>
    
         
        
   
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Enter time (e.g., 4:00)"
        />
        
        <select value={time} onChange={(e) => setTime(e.target.value)}>
          <option value="">Select Time</option>
          {availableTimes.map((timeOption, index) => (
            <option key={index} value={timeOption}>{timeOption}</option>
          ))}
        </select>
        <select value={AMPM} onChange={(e) => setAMPM(e.target.value)}>
          <option value="">Select AM/PM</option>
          {availableAM.map((timeOption, index) => (
            <option key={index} value={timeOption}>{timeOption}</option>
          ))}
        </select>
        <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
          <option value="">Select Day</option>
          {availableDays.map((timeOption, index) => (
            <option key={index} value={timeOption}>{timeOption}</option>
          ))}
        </select>
        <input
          type="number"
          value={caffeine}
          onChange={(e) => setCaffeine(e.target.value)}
          placeholder="Caffeine amount (mg)"
        />
        <Button onClick={() => {handleSubmit()}}>Add to Chart</Button>
        <Button onClick={() => {AddCaffeineToCurrentTime()}}>Add Caffeine To Current Time</Button>
      </div>

      <LineChart
        width={1800}
        height={400}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Caffeine"
          stroke="#8884d8"
          activeDot={{ r: 0 }}
        />
      </LineChart>
      
      <div>
        <Button onClick={() => {Monday()}}>Monday</Button>
        <Button onClick={() => {Tuesday()}}>Tuesday</Button>
        <Button onClick={() => {Wednesday()}}>Wednesday</Button>
        <Button onClick={() => {Thursday()}}>Thursday</Button>
        <Button onClick={() => {Friday()}}>Friday</Button>
        <Button onClick={() => {Saturday()}}>Saturday</Button>
        <Button onClick={() => {Sunday()}}>Sunday</Button>
        <Button onClick={() => {clearData()}}>Clear Graph</Button>
        <Button onClick={() => {processCaffeineData()}}>process caffeine Graph</Button>

      </div>
      
    </>
  );
  */