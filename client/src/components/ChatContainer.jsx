import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import {  FaXmark , FaPlus, FaUser } from "react-icons/fa6";
import { PiMicrophoneFill } from "react-icons/pi";
import { FaRegFaceLaugh } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { useChatContext } from '../context/ChatContext';
import MessagesLoadingSkeleton from './skeletons/MessagesLoadingSkeleton';
import { formateMessageTime } from '../lib/utils';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const ChatContainer = () => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const messageEndRef = useRef();
    // console.log(image)
    const {selectedUser, messages, getMessages, messagesLoading, sendMessage, chatUsers} = useChatContext();
    const {user, onlineusers, socket} = useAuthContext();
    useEffect(() => {
        getMessages(selectedUser._id);
        socket.on("newMessage", (newMessage) => {
          useChatContext.setState((state) => ({
            messages: [...state.messages, newMessage]
          }))
        });
        return () => socket.off("newMessage")
        // const handleKeyDown = (e) => {
        //   if(e.key === "Escape"){
        //     setImage(null);
        //   }
        // };
        // document.addEventListener("keydown", handleKeyDown);
        // return () => document.removeEventListener("keydown",handleKeyDown)
    },[selectedUser._id, getMessages]);

    useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'auto'})
    },[messages])

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if(!file.type.startsWith("image/")){
        toast.error("please select an image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result)
      };
      reader.readAsDataURL(file)
    };

    const removeImage = () => {
      setImage(null)
    }

    const handleSendMessages = async (e) => {
      e.preventDefault();
      if(!text.trim() && !image) return toast.error("Can't send empty message");
      try {
        await sendMessage({text, image});
        setText("");
        setImage(null)
      } catch (error) {
        toast.error("Failed to send message")
      }
    }

    if(messagesLoading) return <MessagesLoadingSkeleton />

  return (
    <>
      <div className='bg-[#f0f2f5] h-20 flex items-center px-5 justify-between'>
        <div className='flex items-center gap-3'>
            <img src={selectedUser?.profilePic} alt="" className='w-16 h-16 rounded-full cursor-pointer' />
            <div className='flex flex-col'>
              <p className='text-md font-semibold select-none'>{selectedUser?.userName}</p>
              <p>{onlineusers.includes(selectedUser?._id) ? "Online" : "Offline"}</p>
            </div>  
        </div>
        <div className='flex items-center gap-7 text-xl'>
            <div className='hover:bg-[rgb(217,219,223)] p-2 rounded-full cursor-pointer'><IoSearch /></div>
            <div className='hover:bg-[rgb(217,219,223)] p-2 rounded-full cursor-pointer'><BsThreeDotsVertical /></div>
        </div>
      </div>

    {/* Messeges Area */}
      <div className='bg-[url("./assets/chat-area.jpg")] flex-1 bg-cover bg-center overflow-hidden'>
        <div className='flex flex-col gap-3 overflow-y-auto h-full mx-2 my-1'>
          {messages.map((message, index) => {
            return (
              <div key={index} className={`px-3 py-1 rounded-md max-w-md  w-fit flex items-center gap-1 cursor-pointer ${message?.senderId === selectedUser?._id ? "self-start" : "self-end"}`} ref={messageEndRef}>
                <div>
                  <div className='size-12'><img src={message.senderId === user._id ? user.profilePic : selectedUser.profilePic} alt="profilePic" /></div>
                </div>
                <div className={`flex flex-col px-2 py-1 ${message?.senderId === selectedUser?._id ? "bg-white " : "bg-[#d9fcd3]"}`}>
                  {message.image && <img src={message.image} alt='attachment' className='sm:max-w-[200px] rounded-md mb-1' />}
                  {message.text && <p className={`flex flex-col font-semibold rounded-md`}>{message?.text} <time className='self-end text-sm font-normal'>{formateMessageTime(message?.createdAt)}</time></p>}
                </div>  
              </div>
            )
          })}
        </div>
      </div>
     
    {/* Inputs */}
      <form onSubmit={handleSendMessages} className='bg-[#f0f2f5] h-14 flex items-center px-5 gap-5 relative transition-all duration-500 ease-linear'>
      {image && <div className='rounded-md p-5 absolute bottom-16 left-5 ' style={{background: "rgba(0,0,0,0.5)"}}><img src={image} alt="" className='w-72 ' /> <FaXmark className='absolute top-1 right-1 text-white cursor-pointer hover:text-green-500 transition-all duration-200 ease-linear' onClick={removeImage}/></div>}
        <div className='text-[rgb(59,74,84)] text-2xl cursor-pointer'><label htmlFor="img"><FaPlus className='cursor-pointer'/> <input type="file" id='img' className='hidden' accept='image/*' onChange={handleImageChange}/></label></div>
        <div className='flex items-center gap-3 py-2 rounded-lg px-5 flex-1 bg-white'><FaRegFaceLaugh className='text-[rgb(59,74,84)] text-2xl cursor-pointer' /><input className='outline-none w-full' value={text} onChange={(e) => setText(e.target.value)} type="text" placeholder='Type a message' /></div>
        <button type='submit' className='text-[rgb(59,74,84)] text-2xl cursor-pointer' disabled={!text.trim() && ! image}><IoIosSend className='active:text-[rgb(75,222,105)]'/></button>
        <div className='text-[rgb(59,74,84)] text-2xl cursor-pointer'><PiMicrophoneFill /></div>
      </form>
    </>
  )
}

export default ChatContainer
