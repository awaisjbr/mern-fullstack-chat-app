import React, { useState } from "react";
import { FaForumbee } from "react-icons/fa6";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        setLoading(true);
        try {
            const {data} = await axios.post('http://localhost:4000/api/auth/forgot-password', {email});
            if(data.success){
                toast.success(data.message);
                navigate("/forgot-reset-password")
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            setLoading(false)
        }
    }

  return (
    <div className='bg-[url("./assets/login.jpg")]  w-screen bg-center bg-cover h-screen relative flex items-center justify-center'>
      <div className="bg-white/30 backdrop-blur-sm max-w-[360px] w-full h-[50%] flex items-center flex-col py-5 justify-evenly">
        <h1 className="flex items-center gap-3 text-xl font-semibold">
          <FaForumbee />
          Chatto
        </h1>
        
        <form className="flex flex-col gap-5" onSubmit={handleVerifyEmail}>
            <div className='flex flex-col gap-1'>
                <label htmlFor="email">Email</label>
                <input className='p-1 rounded-sm outline-none' type="text" name='email' value={email} placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} />
            </div>
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

export default ForgotPassword;

