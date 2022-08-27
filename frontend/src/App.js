import './newApp.css';
import Toolbar from './components/Toolbar';
import MyLikes from './pages/MyLikes';
import SwipePage from './pages/SwipePage';
import FilterPage from './pages/FilterPage';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import mainContext from './context/mainContext';
import { useEffect, useState } from 'react';
import  io  from 'socket.io-client';


const socket = io.connect("http://localhost:4001");

function App() {
  const [currentUser, setCurrentUser] = useState()
  const [picLength, setPicLength] = useState(0)
  const [notif, setNotif] = useState()

  const props = {
    currentUser,
    setCurrentUser,
    setPicLength,
    picLength,
    socket,
    notif,
    setNotif
  }
  
  useEffect(() => {
    socket.on("notification", message => {
      setNotif("🕭")
      
    })
    if (!currentUser){
      const options = {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include"
      };
      fetch("http://localhost:4001/getUser", options)
        .then((r) => r.json())
        .then((data) => {
          setCurrentUser(data.user)
        })
    } 
  })
  return (
    <div className="App">
    <mainContext.Provider value={props}>
    <BrowserRouter>
      <Toolbar></Toolbar>
      
      <Routes>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/userProfile" element={<UserProfile></UserProfile>}></Route>
        <Route path="/filter" element={<FilterPage></FilterPage>}></Route>
        <Route path="/swipe" element={<SwipePage></SwipePage>}></Route>
        <Route path="/likes" element={<MyLikes></MyLikes>}></Route>
      </Routes>  
    </BrowserRouter>
    </mainContext.Provider>
    </div>
  );
}

export default App;
