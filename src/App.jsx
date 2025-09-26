import React, { useContext, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Chat from './Pages/Chat/Chat';
import ProfileUpdate from './Pages/ProfileUpdate/ProfileUpdate';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Config/Firebase';
import { AppContext } from './Context/AppContext';

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
