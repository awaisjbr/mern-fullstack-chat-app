import React, { useContext, useEffect, useState } from 'react';
import { FaForumbee } from "react-icons/fa6";
import { LuEyeClosed } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { NavLink, useNavigate } from 'react-router-dom';
import { TailSpin } from "react-loader-spinner";
import { useAuthContext } from '../context/AuthContext';
import {LoaderCircle} from "lucide-react"


const Login = () => {
    const navigate = useNavigate();
    const {signup, isEmailVerified, loading, login} = useAuthContext();
    const [loginState, setLoginState] = useState('Login');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if(!isEmailVerified) navigate("/verify-email")
    },[isEmailVerified, navigate])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]:value});
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if(loginState === "Login"){
            login(formData)
        }else{
            signup(formData)
        }
    };

  return (
    <div className='bg-[url("./assets/login.jpg")] w-screen bg-center bg-cover h-screen relative flex items-center justify-center'>
      <div className='bg-white/30 backdrop-blur-sm max-w-[360px] w-full h-[80%] flex items-center flex-col py-5 justify-between'>
        <h1 className='flex items-center gap-3 text-xl font-semibold'> <FaForumbee />Chatto</h1>
        <div className='flex items-center flex-col w-full'>
            <h1 className='text-2xl font-semibold'>Welcome Back</h1>
            <p className='text-xs mt-2 mb-5'>{loginState === "Login"? "Enter your email and password to access your account" : "Fill the form fields for registration"}</p>
            <form className='w-[70%] flex flex-col gap-3' onSubmit={handleFormSubmit}>
                {loginState === "Login" ? null : <div className='flex flex-col gap-1'>
                    <label htmlFor="username">username</label>
                    <input className='p-1 rounded-sm outline-none' type="text" name='userName' value={formData.userName} placeholder='Enter your Name' onChange={handleChange} />
                </div>}
                <div className='flex flex-col gap-1'>
                    <label htmlFor="email">Email</label>
                    <input className='p-1 rounded-sm outline-none' type="text" name='email' value={formData.email} placeholder='Enter your email' onChange={handleChange} />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="password">Password</label>
                    <div className='relative'>
                        <input className='w-full p-1 rounded-sm outline-none' name='password' type={showPassword ? "text" : "password"} value={formData.password} placeholder='Enter your password' onChange={handleChange} />
                        {showPassword ? <LuEyeOff className='absolute top-2 cursor-pointer right-2' onClick={() => setShowPassword((prev) => !prev)} title='Hide Password'/> : <LuEyeClosed className='absolute top-2 cursor-pointer right-2' onClick={() => setShowPassword((prev) => !prev)} title='Show Password'/>}
                    </div>
                </div>
                <div className='flex items-center justify-between'>
                    <label className='text-xs flex items-center gap-1'><input type="checkbox"/>Remember me</label>
                    <NavLink to={"/forgot-password"} className="text-sm hover:underline">Forgot Password</NavLink>
                </div>
                <button type='submit' className='bg-[#5549c9] text-white w-full py-1 my-1 rounded-sm'>{loginState === "Login" ? "Sign In" : "Register"}</button>
                {loginState === "Login"? <button className='flex items-center gap-2 bg-white py-1 px-2 rounded-lg mx-auto'><FcGoogle className='text-xl' />Sign In with google</button>: null}
            </form>
        </div>
        <h3 className='text-sm'>{loginState === "Login" ? "Don't have an account?" : "Already have an account?"} <NavLink onClick={() => loginState === "Login" ? setLoginState("Signup") : setLoginState("Login")} className="text-lg hover:underline">{loginState === "Login" ? "Sign Up" : "Sign In"}</NavLink></h3>
      </div>
      {loading && (
        <div className='h-screen w-full flex items-center justify-center absolute top-0 left-0' style={{background:"rgba(0,0,0,0.7)", zIndex:"1"}}>
            <LoaderCircle strokeWidth={1} className="size-40 animate-spin text-[#5549c9]" />
            
        {/* <TailSpin
          visible={true}
          height="180"
          width="180"
          color="#5549c9"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        /> */}
      </div>
      )}
    </div>
  )
}

export default Login
