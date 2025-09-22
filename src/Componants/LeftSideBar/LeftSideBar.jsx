import React from 'react'
import './LeftSideBar.css'
import assets from '../../assets/assets'
const LeftSideBar = () => {
  return (
    <div className='ls'>
      <div className="lstop">
        <div className="lsnav">
          <img src={assets.logo} className='logo' alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className='submenu'>
              <p>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
          </div>
          <div className="lssearch">
            <img src={assets.search_icon} alt="" />
            <input type="text" placeholder='Search or start new chat' />
          </div>
        
      </div>
      <div className="lslist">
        {
          Array(12).fill("").map((item,index)=>
          <div key={index}className="friends">
          <img src={assets.profile_img} alt="" />
          <div>
            <p>Atharv Kulkarni</p>
            <span>This is a message</span>
          </div>
        </div>)

        }
      </div>
    </div>
  )
}

export default LeftSideBar
