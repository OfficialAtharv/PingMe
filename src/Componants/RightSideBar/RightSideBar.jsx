import React from "react";
import "./RightSideBar.css";
import assets from "../../assets/assets";
import { logout } from "../../Config/Firebase";
const RightSideBar = () => {
  return (
    <div className="rs">
      <div className="rsprofile">
        <img src={assets.profile_img} alt="" />
        <h3>
          Atharv Kulkarni <img src={assets.green_dot} className="dot" alt="" />
        </h3>
        <p>Hey i am coding for the profile image !</p>
      </div>
      <hr />
      <div className="rsmedia">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
        </div>
      </div>
      <div>
        <button onClick={()=>logout()}>Logout</button>
      </div>
    </div>
  )
}

export default RightSideBar;
