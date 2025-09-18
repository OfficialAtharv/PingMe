import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Chat from './Pages/Chat/Chat'
import ProfileUpdate from './Pages/ProfileUpdate/ProfileUpdate'
const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/Chat' element={<Chat/>} />
        <Route path='/Profile' element={<ProfileUpdate/>} />
      </Routes>
    </>
  )
}

export default App
