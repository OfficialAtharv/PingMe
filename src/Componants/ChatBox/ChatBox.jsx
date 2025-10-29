import React from "react";
import "./ChatBox.css";
import assets from "../../assets/assets";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { getDoc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { doc } from "firebase/firestore";
import { db } from "../../Config/Firebase";
import { toast } from "react-toastify";
import { updateDoc, arrayUnion } from "firebase/firestore";
import Upload from "../../lib/Upload";
const ChatBox = () => {
  const {
    userData,
    messageId,
    chatUser,
    messages,
    setMessages,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);
  const [input, setInput] = React.useState("");
  useEffect(() => {
    if (messageId) {
      const unsub = onSnapshot(doc(db, "messages", messageId), (res) => {
        setMessages(res.data().messages.reverse());
        console.log(res.data().messages.reverse());
      });
      return () => {
        unsub();
      };
    }
  }, [messageId]);
  const sendmessage = async () => {
    try {
      if (input && messageId) {
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        const userId = [chatUser.rId, userData.id];
        userId.forEach(async (id) => {
          const userchatRef = doc(db, "chats", id);
          const userChatSnapShot = await getDoc(userchatRef);
          if (userChatSnapShot.exists()) {
            const userChatData = userChatSnapShot.data();
            const ChatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messageId
            );
            userChatData.chatsData[ChatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[ChatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[ChatIndex].rId === userData.id) {
              userChatData.chatsData[ChatIndex].messageSeen = false;
            }
            await updateDoc(userchatRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      toast("Failed to send message: " + error.message);
    }
    setInput("");
  };
  const converttimestamp = (timestamp) => {
    const date = timestamp.toDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (hours > 12) {
      return hours - 12 + ":" + minutes + "PM";
    } else {
      return hours + ":" + minutes + "AM";
    }
  };
  const sendimage = async (e) => {
    try {
      const fileurl = await Upload(e.target.files[0]);
      if (fileurl && messageId) {
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileurl,
            createdAt: new Date(),
          }),
        });
        const userId = [chatUser.rId, userData.id];
        userId.forEach(async (id) => {
          const userchatRef = doc(db, "chats", id);
          const userChatSnapShot = await getDoc(userchatRef);
          if (userChatSnapShot.exists()) {
            const userChatData = userChatSnapShot.data();
            const ChatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messageId
            );
            userChatData.chatsData[ChatIndex].lastMessage = " Sent an image";
            userChatData.chatsData[ChatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[ChatIndex].rId === userData.id) {
              userChatData.chatsData[ChatIndex].messageSeen = false;
            }
            await updateDoc(userchatRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      toast("Failed to send image: " + error.message);
    }
  };
  return chatUser ? (
    <div className={`chatbox ${chatVisible ? "" : "hidden"} `}>
      <div className="chatuser">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name}
          {Date.now() - chatUser.userData.lastseen <= 70000 ? (
            <img src={assets.green_dot} className="dot" alt="" />
          ) : null}
        </p>
        <img src={assets.help_icon} alt="" />
        <img
          src={assets.arrow_icon}
          className="arrow"
          onClick={() => setChatVisible(false)}
          alt=""
        />
      </div>
      <div className="chatmessage">
        {messages.map((msg, index) => (
          <div
            className={msg.sId === userData.id ? "smassage" : "rmassage"}
            key={index}
          >
            {msg["image"] ? (
              <img className="messageimg" src={msg.image} alt="sent image" />
            ) : (
              <p className="message">{msg.text}</p>
            )}

            <div>
              <img
                src={
                  msg.sId === userData.id
                    ? userData.avatar
                    : chatUser.userData.avatar
                }
                alt=""
              />
              <p>{converttimestamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="chatinput">
        <input
          type="text"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          placeholder="Send a message "
        />
        <input
          onChange={sendimage}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendmessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className={`chatbox ${chatVisible ? "" : "hidden"} `}>
      <img src={assets.logo_icon} alt="" />
      <p>Welcome to PingMe , Chat Any time Any where </p>
    </div>
  );
};

export default ChatBox;
