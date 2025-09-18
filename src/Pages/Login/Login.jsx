import React from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { useState } from "react";

const Login = () => {
  const [currState, setCurrState] = useState("Sign Up");
  return (
    <div className="login">
      <img className="logo" src={assets.logo_big} alt="" />
      <form className="loginform">
        <h2>{currState}</h2>
        {currState==="Sign Up"?<input type="text" placeholder="Username" required className="form-input" />:null}
        <input type="email" placeholder="Email Address" required className="form-input" />
        <input type="Password" placeholder="password" required className="form-input" />
        <button type="submit">{currState==="Sign Up" ? "Create Accout":"Login Now"}</button>
        <div className="loginterm">
          <input type="checkbox" />
          <p>Agree to the terms and condition applied ! </p>
        </div>
        <div className="loginforgot">
          {currState==="Sign Up"
          ? <p className="logintoggle"> already have an account ? <span onClick={()=>setCurrState("Login")}>Login here </span></p>
          :<p className="logintoggle">Create an Account <span onClick={()=>setCurrState("Sign Up")}>Click here </span></p>
          
        } 
        </div>
      </form>
    </div>
  );
};

export default Login;
