import React, { useState } from "react";
import { FaForumbee } from "react-icons/fa6";
import { LuEyeClosed } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import axios from "axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";
import { TailSpin } from "react-loader-spinner";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotResetPassword = () => {
    const navigate = useNavigate();
    const [verificationOTP, setVerificationOTP] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        setLoading(true);
        try {
            const {data} = await axios.post('http://localhost:4000/api/auth/reset-password', {verificationOTP,password});
            if(data.success){
                toast.success(data.message);
                navigate("/login")
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            setLoading(false)
        }
    }

    if(loading){
        return <div>Loading...</div>
    }

  return (
    <div className='bg-[url("./assets/login.jpg")] w-screen bg-center bg-cover h-screen relative flex items-center justify-center'>
      <div className="bg-white/30 backdrop-blur-sm max-w-[360px] w-full h-[50%] flex items-center flex-col py-5 justify-evenly">
        <h1 className="flex items-center gap-3 text-xl font-semibold">
          <FaForumbee />
          Chatto
        </h1>
        
        <form className="flex flex-col gap-5" onSubmit={handleVerifyEmail}>
          <InputOTP maxLength={6} value={verificationOTP} onChange={(value) => setVerificationOTP(value)}>
            <InputOTPGroup >
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className='flex flex-col gap-1'>
            <label htmlFor="password">New Password</label>
            <div className='relative'>
                <input className='w-full p-1 rounded-sm outline-none' name='password' type={showPassword ? "text" : "password"} value={password} placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
                {showPassword ? <LuEyeOff className='absolute top-2 cursor-pointer right-2' onClick={() => setShowPassword((prev) => !prev)} title='Hide Password'/> : <LuEyeClosed className='absolute top-2 cursor-pointer right-2' onClick={() => setShowPassword((prev) => !prev)} title='Show Password'/>}
            </div>
          </div>
          <button type="submit" className="text-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md cursor-pointer font-semibold">Change Password</button>
        </form>

      </div>
      {loading && (
          <div className='h-screen w-full flex items-center justify-center absolute top-0 left-0' style={{background:"rgba(0,0,0,0.7)", zIndex:"1"}}>
          <TailSpin
            visible={true}
            height="180"
            width="180"
            color="#5549c9"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
        )}
    </div>
  );
};

export default ForgotResetPassword;

