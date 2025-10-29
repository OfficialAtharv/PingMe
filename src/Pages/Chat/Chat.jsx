import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import LeftSideBar from "../../Componants/LeftSideBar/LeftSideBar";
import ChatBox from "../../Componants/ChatBox/ChatBox";
import RightSideBar from "../../Componants/RightSideBar/RightSideBar";
import { AppContext } from "../../Context/AppContext";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData && chatData !== null) {
      setLoading(false);
    }
  }, [userData, chatData]);

  return (
    <div className="chat">
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="chatcontainer">
          <LeftSideBar />
          <ChatBox />
          <RightSideBar />
        </div>
      )}
    </div>
  );
};

export default Chat;
