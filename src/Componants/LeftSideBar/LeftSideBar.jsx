import React, { useContext, useState } from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db, logout } from "../../Config/Firebase";
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";
import { updateDoc } from "firebase/firestore";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    setChatData,
    chatUser,
    setChatUser,
    setMessageId,
    messageId,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputHandler = async (e) => {
    const input = e.target.value.trim();
    if (!input) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    try {
      setLoading(true);
      setShowSearch(true);

      const userRef = collection(db, "users");
      const q = query(
        userRef,
        where("username", ">=", input),
        where("username", "<=", input + "\uf8ff")
      );
      const querySnap = await getDocs(q);

      const filtered = querySnap.docs
        .map((docItem) => ({ ...docItem.data(), id: docItem.id }))
        .filter((user) => user.id !== userData.id);

      setSearchResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search users.");
    } finally {
      setLoading(false);
    }
  };

  const addChat = async (user) => {
    try {
      const localChat = chatData?.find((chat) => chat.rId === user.id);
      if (localChat) {
        setChat(localChat);
        return;
      }

      const chatRef = doc(db, "chats", userData.id);
      const chatSnap = await getDoc(chatRef);
      const chats = chatSnap.data()?.chatsData || [];
      const existingChat = chats.find((c) => c.rId === user.id);

      if (existingChat) {
        setChat({ ...existingChat, userData: user });

        setChatData((prev) => {
          if (!prev?.some((c) => c.rId === user.id)) {
            return [...(prev || []), { ...existingChat, userData: user }];
          }
          return prev;
        });
        return;
      }

      const messagesRef = collection(db, "messages");
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const newChat = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: user.id,
        rName: user.username,
        updatedAt: Date.now(),
        messageseen: true,
      };

      await setDoc(
        doc(db, "chats", userData.id),
        { chatsData: arrayUnion(newChat) },
        { merge: true }
      );
      await setDoc(
        doc(db, "chats", user.id),
        {
          chatsData: arrayUnion({
            messageId: newMessageRef.id,
            lastmessage: "",
            rId: userData.id,
            rName: userData.username,
            updatedAt: Date.now(),
            messageseen: true,
          }),
        },
        { merge: true }
      );

      setChatData((prev) => {
        if (!prev?.some((c) => c.rId === user.id)) {
          return [...(prev || []), { ...newChat, userData: user }];
        }
        return prev;
      });

      setChat({ ...newChat, userData: user });
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const setChat = async (chat) => {
    try {
      setMessageId(chat.messageId);
      setChatUser(chat);
      const userChatRef = doc(db, "chats", userData.id);
      const userChatsSnapshot = await getDoc(userChatRef);
      const userChatsData = userChatsSnapshot.data();
      const ChatIndex = userChatsData.chatsData.findIndex(
        (c) => c.messageId === chat.messageId
      );
      userChatsData.chatsData[ChatIndex].messageSeen = true;
      await updateDoc(userChatRef, {
        chatsData: userChatsData.chatsData,
      });
      setChatVisible(true);
    } catch (error) {
      toast.error("Failed to open chat: " + error.message);
    }
  };

  const uniqueChats = chatData && [
    ...new Map(chatData.map((c) => [c.rId, c])).values(),
  ];

  return (
    <div className={`ls ${chatVisible ? "hidden" : ""}`}>
      <div className="lstop">
        <div className="lsnav">
          <img src={assets.logo} className="logo" alt="Logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="Menu" />
            <div className="submenu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={() => logout()}>Logout</p>
            </div>
          </div>
        </div>

        <div className="lssearch">
          <img src={assets.search_icon} alt="Search" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search or start new chat"
          />
        </div>
      </div>

      <div className="lslist">
        {loading ? (
          <p className="loading">Searching...</p>
        ) : showSearch && searchResults.length > 0 ? (
          searchResults.map((user) => (
            <div
              key={user.id}
              className="friends"
              onClick={() => addChat(user)}
            >
              <img
                src={user.avatar || assets.profile_img}
                alt="avatar"
                className="friend-avatar"
              />
              <div>
                <p>{user.name || user.username}</p>
                <span>{user.lastMessage || "No messages yet"}</span>
              </div>
            </div>
          ))
        ) : uniqueChats?.length > 0 ? (
          uniqueChats
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((chat, index) => (
              <div
                onClick={() => setChat(chat)}
                key={index}
                className={`friends ${
                  chat.messageSeen || chat.messageId === messageId
                    ? ""
                    : "border"
                }`}
              >
                <img
                  src={chat.userData?.avatar || assets.profile_img}
                  alt="Profile"
                  className="friend-avatar"
                />
                <div>
                  <p>{chat.userData?.name || chat.rName || "Friend"}</p>
                  <span>{chat.lastMessage || "No messages yet"}</span>
                </div>
              </div>
            ))
        ) : (
          <p className="empty-text">No chats yet. Start one!</p>
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
