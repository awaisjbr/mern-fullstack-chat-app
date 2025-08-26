import React, { useState } from "react";
import { FaForumbee } from "react-icons/fa6";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const VerifyEmail = () => {
  const {verifyEmail, loading} = useAuthContext()
    const navigate = useNavigate();
    const [verificationOTP, setVerificationOTP] = useState("");
    // const [loading, setLoading] = useState(false);
    
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        verifyEmail(verificationOTP);
    }

  return (
    <div className='bg-[url("./assets/login.jpg")] bg-center bg-cover w-screen h-screen relative flex items-center justify-center'>
      <div className="bg-white/30 backdrop-blur-sm max-w-[360px] w-full h-[50%] flex items-center flex-col py-5 justify-evenly">
        <h1 className="flex items-center gap-3 text-xl font-semibold"><FaForumbee />Chatto</h1>
        
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
          <button type="submit" className="text-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md cursor-pointer font-semibold">Verify Email</button>
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

export default VerifyEmail;
