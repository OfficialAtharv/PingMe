import React, { useEffect, useState } from "react";
import "./RightSideBar.css";
import assets from "../../assets/assets";
import { logout } from "../../Config/Firebase";
import { AppContext } from "../../Context/AppContext";
import { useContext } from "react";
const RightSideBar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImages, setmsgImages] = useState([]);
  useEffect(() => {
    let tempVar = [];
    messages.map((msg) => {
      if (msg.image) {
        tempVar.push(msg.image);
      }
    });
    setmsgImages(tempVar);
  }, [messages]);
  return chatUser ? (
    <div className="rs">
      <div className="rsprofile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>
          {Date.now() - chatUser.userData.lastseen <= 70000 ? (
            <img src={assets.green_dot} className="dot" alt="" />
          ) : null}
          {chatUser.userData.name}
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rsmedia">
        <p>Media</p>
        <div>
          {msgImages.map((url, index) => (
            <img
              src={url}
              onClick={() => window.open(url)}
              key={index}
              alt=""
            />
          ))}
        </div>
      </div>
      <div>
        <button onClick={() => logout()}>Logout</button>
      </div>
    </div>
  ) : (
    <div className="rs">
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default RightSideBar;
