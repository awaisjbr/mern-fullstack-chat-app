import React, { useContext, useEffect } from 'react';
import { formateMessageTime } from '../lib/utils';
import SideMenubar from '../components/SideMenubar';
import SideUsersList from '../components/SideUsersList';
import ChatBox from '../components/ChatBox';
import { axiosInstance } from '../components/AxiosInstance';
import { useAuthContext } from '../context/AuthContext';

const Home = () => {
  // const {} = useAuthContext
  return (
    <div className='bg-white absolute top-7 bottom-7 right-8 left-7 z-50 '>
      <div className='w-full h-full flex'>
        <SideMenubar />
        <SideUsersList/>
        <ChatBox />
      </div>      
    </div>
  )
}

export default Home
