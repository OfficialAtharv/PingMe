import React from 'react'
import './Chat.css'
import LeftSideBar from '../../Componants/LeftSideBar/LeftSideBar'
import ChatBox from '../../Componants/ChatBox/ChatBox'
import RightSideBar from '../../Componants/RightSideBar/RightSideBar'
const Chat = () => {
  return (
    <div className='chat'>
      <div className="chatcontainer">
        <LeftSideBar/>
        <ChatBox/>
        <RightSideBar/>
      </div>
    </div>
  )
}

export default Chat
