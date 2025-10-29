import { createContext, useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../Config/Firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const navigate = useNavigate();
  const [messageId, setMessageId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const loaduserdata = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const data = userSnap.data();
      setUserData({ ...data, id: uid });

      if (data.avatar && data.name) {
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
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data()?.chatsData || [];
        const tempData = [];
        for (const item of chatItems) {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          tempData.push({ ...item, userData: userSnap.data() });
        }
        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
      });

      return () => unSub();
    }
  }, [userData]);
  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loaduserdata,
    messages,
    setMessages,
    messageId,
    setMessageId,
    chatUser,
    setChatUser,
    chatVisible,
    setChatVisible,
  };
  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData,
        chatData,
        setChatData,
        loaduserdata,
        messages,
        setMessages,
        messageId,
        setMessageId,
        chatUser,
        setChatUser,
        chatVisible,
        setChatVisible,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
