import React, { useContext, useState } from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../Config/Firebase";
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

 
  const inputHandler = async (e) => {
    try {
      const input = e.target.value.trim();
      if (!input) {
        setShowSearch(false);
        setSearchResults([]);
        return;
      }

      setShowSearch(true);

      const userRef = collection(db, "users");
      const allDocs = await getDocs(userRef);

      const filtered = allDocs.docs
        .map((docItem) => {
          const data = docItem.data();
          return {
            ...data,
            id: data.id || docItem.id,     
            username: data.username || "",  
          };
        })
        .filter(
          (user) =>
            user.username &&
            user.username.toLowerCase().includes(input.toLowerCase()) &&
            user.id &&
            user.id !== userData.id          
        );

      setSearchResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  
  const addChat = async (user) => {
    try {
      const messagesRef = collection(db, "messages");
      const chatsRef = collection(db, "chats");

      
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      
      await setDoc(
        doc(chatsRef, user.id),
        {
          chatsData: arrayUnion({
            messageId: newMessageRef.id,
            lastmessage: "",
            rId: userData.id,
            updatedAt: Date.now(),
            messageseen: true,
          }),
        },
        { merge: true }
      );

      
      await setDoc(
        doc(chatsRef, userData.id),
        {
          chatsData: arrayUnion({
            messageId: newMessageRef.id,
            lastmessage: "",
            rId: user.id,
            updatedAt: Date.now(),
            messageseen: true,
          }),
        },
        { merge: true }
      );

      toast.success("Chat created successfully!");
    } catch (error) {
      console.error("Chat creation error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="ls">
      
      <div className="lstop">
        <div className="lsnav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="submenu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>


        <div className="lssearch">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search or start new chat"
          />
        </div>
      </div>

      
      <div className="lslist">
        {showSearch && searchResults.length > 0 ? (
          
          searchResults.map((user) => (
            <div
              key={user.id}
              className="friends"
              onClick={() => addChat(user)}
            >
              <img
                src={user.avatar || assets.profile_img}
                alt=""
                className="friend-avatar"
              />
              <div>
                <p>{user.name || user.username}</p>
                <span>Online</span>
              </div>
            </div>
          ))
        ) : (
          
          Array(12)
            .fill("")
            .map((item, index) => (
              <div key={index} className="friends">
                <img
                  src={assets.profile_img}
                  alt=""
                  className="friend-avatar"
                />
                <div>
                  <p>Atharv Kulkarni</p>
                  <span>This is a message</span>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
