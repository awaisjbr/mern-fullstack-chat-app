import { axiosInstance } from "../components/AxiosInstance";
import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:4000"
export const useAuthContext = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  isEmailVerified: true,
  isforgotPassword: false,
  isPasswordReseting: false,
  onlineusers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const { data } = await axiosInstance.get("/auth/checkAuth");
      if (data.success) {
        set({ user: data.user, isAuthenticated: true });
        get().connectSocket();
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    }
  },

  signup: async (credentials) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.post("/auth/register", credentials);
      if (data.success) {
        set({ isEmailVerified: false, loading: false });
        toast.success(data.message);
      }else{
        toast.error(data.message);
        set({ loading: false, loading: false, user: null})
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
      set({ isEmailVerified: true, loading: false, user: null });
    }
  },

  verifyEmail: async (verificationOTP) => {
    set({ loading: true });
    try {
        const {data} = await axiosInstance.post("/auth/verifyEmail", {verificationOTP});
        if(data.success){
            toast.success(data.message);
            set({user:null, isAuthenticated:false, loading:false, isEmailVerified:true})
        }else{
            toast.error(data.message);
            set({ loading: false})
        }
    } catch (error) {
        toast.error(error?.response?.data?.message || "Email Verfication Failed");
        set({ loading: false})
    }
  },

  login: async (credentials) => {
    set({loading: true})
    try {
        const {data} = await axiosInstance.post("/auth/login", credentials);
        if(data.success){
            set({isAuthenticated: true, loading:false, user: data.user});
            toast.success(data.message);
            get().connectSocket();
        }else{
            toast.error(data.message);
            set({ loading: false})
          }
    } catch (error) {
        toast.error(error?.response?.data?.message || "Login failed");
        set({loading: false})
    }
  },

  logout: async () => {
    set({loading: true});
    try {
        const result = confirm("Are you sure to logout");
        if(result){
          const {data} = await axiosInstance.post("/auth/logout");
          if(data.success){
            toast.success(data.message);
            set({isAuthenticated: false, user: null, loading: false})
            get().disConnectSocket();
          }
        }
    } catch (error) {
        toast.error(error?.response?.data?.message || "Logout failed");
        set({loading: false})
    }
  },

  updateProfilePic: async (profilePic) => {
    
  },

  forgotPassword: async () => {
    set({isforgotPassword: true});
  },

  connectSocket: () => {
    const {user} = get();
    if(!user || get().socket?.connected) return;
    const socket = io(BASE_URL,{
      query: {
        userId: user._id,
      }
    });
    socket.connect();
    set({socket});
    socket.on("getOnlineUsers", (usersIds) => {
      set({onlineusers: usersIds})
    })
  },

  disConnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  }
  
}));
