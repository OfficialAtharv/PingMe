<<<<<<< HEAD
import React, { useEffect } from 'react'
import { Route, Routes,useNavigate } from 'react-router-dom'
=======
import React, { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
>>>>>>> 75c1f2f (Finally updated  the profile with Firebase database check the ReadMe file where i have stored the screenshot of the 1st record updated)
import Login from './Pages/Login/Login'
import Chat from './Pages/Chat/Chat'
import ProfileUpdate from './Pages/ProfileUpdate/ProfileUpdate'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './Config/Firebase'
<<<<<<< HEAD
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
=======
import { AppContext } from './Context/AppContext'

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loaduserdata } = useContext(AppContext);

  useEffect(() => {
    // run only once on mount
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is signed in:", user);

        // call loaduserdata but don't trigger re-creation of listener
        loaduserdata(user.uid);

        if (location.pathname !== "/Chat") {
          navigate("/Chat");
        }
      } else {
        console.log("No user is signed in.");
        if (location.pathname !== "/") {
          navigate("/");
        }
      }
    });

    return () => unsubscribe();
    // empty dependency array ensures this effect runs only once
  }, []); // DO NOT put loaduserdata or navigate here

>>>>>>> 75c1f2f (Finally updated  the profile with Firebase database check the ReadMe file where i have stored the screenshot of the 1st record updated)
  return (
    <>
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/Profile" element={<ProfileUpdate />} />
      </Routes>
    </>
  );
};

export default App;
