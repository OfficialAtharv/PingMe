import React, { useEffect } from 'react'
import { Route, Routes,useNavigate } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Chat from './Pages/Chat/Chat'
import ProfileUpdate from './Pages/ProfileUpdate/ProfileUpdate'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './Config/Firebase'
const App = () => {
  const navigate=useNavigate();
  useEffect(()=>{
    onAuthStateChanged (auth,async(user)=>{
      if(user){
        console.log("User is signed in:", user);
        navigate("/Chat");
      }
      else{
        console.log("No user is signed in.");
        navigate("/");
      }
    })
  },)
  return (
    <>
    <ToastContainer position='top-center' />
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/Chat' element={<Chat/>} />
        <Route path='/Profile' element={<ProfileUpdate/>} />
      </Routes>
    </>
  )
}

export default App
