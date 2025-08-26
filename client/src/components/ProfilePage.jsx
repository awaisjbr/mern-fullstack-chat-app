import { useAuthContext } from '../context/AuthContext'
import React from 'react'

const ProfilePage = () => {
    const {user, updateProfilePic, loading} = useAuthContext();

    const handleImageUpload = async () => {

    };


  return (
    <div className='absolute top-0 left-0 bg-red-200 h-full w-full '>
      Profile
    </div>
  )
}

export default ProfilePage
