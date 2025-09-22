import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Chat from './Pages/Chat/Chat'
import ProfileUpdate from './Pages/ProfileUpdate/ProfileUpdate'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
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
