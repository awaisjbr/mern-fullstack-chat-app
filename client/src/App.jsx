import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import { loader } from "./components/Loading";
import { Toaster } from "react-hot-toast";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotResetPassword = lazy(() => import("./pages/ForgotResetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

const App = () => {
  const { isAuthenticated,checkAuth, isEmailVerified, user, onlineusers } = useAuthContext();
  // console.log(onlineusers)
  
  useEffect(() => {
      checkAuth()
  },[]);
 
  return (
    <>
      <Suspense fallback={loader}>
        <Toaster position="top-center" duration={7000} />
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={isAuthenticated ?<Navigate to='/' /> :  <Login />} />
          <Route path="/verify-email" element={isEmailVerified ? <Navigate to='/login' /> :<VerifyEmail />} />
          <Route path="/forgot-reset-password" element={<ForgotResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
