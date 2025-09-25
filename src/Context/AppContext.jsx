import { createContext, useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../Config/Firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatdata, setChatData] = useState(null);
  const navigate = useNavigate();

  const loaduserdata = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      setUserData(userData);

      if (userData.avatar && userData.name) {
        navigate("/Chat");
      } else {
        navigate("/Profile");
      }

      await updateDoc(userRef, { lastseen: Date.now() });

      if (!window.lastSeenInterval) {
        window.lastSeenInterval = setInterval(async () => {
          if (auth.currentUser) {
            await updateDoc(userRef, { lastseen: Date.now() });
          }
        }, 60000);
      }
    } catch (error) {
      toast.error("Error fetching user data: " + error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, 'chats', userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data()?.chatsData || [];
        const tempdata = [];
        for (const item of chatItems) {
          const userRef = doc(db, 'users', item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          tempdata.push({ ...item, userData });
        }
        setChatData(tempdata.sort((a,b)=>b.updatedAt - a.updatedAt));
      });

      return () => unSub();
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatdata,
    setChatData,
    loaduserdata,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
