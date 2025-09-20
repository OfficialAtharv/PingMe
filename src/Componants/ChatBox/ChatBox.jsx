import React from "react";
import "./ChatBox.css";
import assets from "../../assets/assets";
const ChatBox = () => {
  return (
    <div className="chatbox">
      <div className="chatuser">
        <img src={assets.profile_img} alt="" />
        <p>
          Atharv Kulkarni <img className="dot" src={assets.green_dot} alt="" />
        </p>
        <img src={assets.help_icon} alt="" />
      </div>
      <div className="chatmessage">
        <div className="smassage">
          <p className="message">Hello, This is a message Lorem ipsum dolor sit amet.</p>
          <div>
            <img src={assets.profile_img} alt="" />
             <p>2:20PM</p>
          </div>
        </div>
        <div className="smassage">
         <img className="messageimg"src={assets.pic1} alt="" />
          <div>
            <img src={assets.profile_img} alt="" />
             <p>2:20PM</p>
          </div>
        </div>
          <div className="rmassage">
          <p className="message">Hello, This is a message Lorem ipsum dolor sit amet.</p>
          <div>
            <img src={assets.profile_img} alt="" />
             <p>2:20PM</p>
          </div>
        </div>
      </div>
      <div className="chatinput">
        <input type="text" placeholder="Send a message " />
        <input type="file" id="image" accept="image/png, image/jpeg" hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_button} alt="" />
      </div>
    </div>
  );
};

export default ChatBox;
