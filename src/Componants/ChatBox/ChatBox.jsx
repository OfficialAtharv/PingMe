import React from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
const ChatBox = () => {
  return (
    <div className='chatbox'>
      <div className="chatuser">
        <img src={assets.profile_img} alt="" />
        <p>Atharv Kulkarni <img src={assets.green_dot} alt="" /></p>
        <img src={assets.help_icon} alt="" />
      </div>
      
    </div>
  )
}

export default ChatBox
