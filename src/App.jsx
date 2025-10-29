import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Chat from "./Pages/Chat/Chat";
import ProfileUpdate from "./Pages/ProfileUpdate/ProfileUpdate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Config/Firebase";
import { AppContext } from "./Context/AppContext";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loaduserdata } = useContext(AppContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        loaduserdata(user.uid);
      } else {
        if (location.pathname !== "/") {
          navigate("/");
        }
      }
    });

    return () => unsubscribe();
  }, []);

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
