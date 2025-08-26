import React from 'react';
import chatboximg from "../assets/chat.jpg"
import { useChatContext } from '../context/ChatContext';
import ChatContainer from './ChatContainer';



const ChatBox = () => {
  const { selectedUser} = useChatContext();

  return (
    <div className='flex-1 flex flex-col overflow-hidden '>
      {selectedUser ? <ChatContainer /> : <img src={chatboximg} className='w-full h-full' alt="" /> }
    </div>
  )
}

export default ChatBox
