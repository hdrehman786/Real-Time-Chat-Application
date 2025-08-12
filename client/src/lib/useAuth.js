import { create } from "zustand";
import axiosinctance from "./axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "https://real-time-chat-application-server-s.vercel.app"

export const useAuth = create((set, get) => ({
  user: null,
  isSigningUp: false,
  isLoging: false,
  isUpdatingProfile: false,
  isCheckingUser: true,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    try {
      const response = await axiosinctance.get("/auth/check");
      set({ user: response?.data });

      if (response.data.success) {
        get().connectSocket();
      }
    } catch (error) {
      console.log("Error is coming from checkAuth", error);
      set({ user: null });
    } finally {
      set({ isCheckingUser: false });
    }
  },

  signUp: async (data) => {
    try {
      set({ isSigningUp: true });

      const response = await axiosinctance.post("/auth/register", data);

      if (response.data.success === true) {
        return { success: true };
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
      return {
        success: false,
        message:
          error?.response?.data?.message || error.message || "Signup failed",
      };
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoging: true });
      const response = await axiosinctance.post("/auth/login", data);
      toast.success("User Login Successfully");
      set({ user: response.data })
      get().connectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    }
  },

  logout: async () => {
    try {
      const response = await axiosinctance.post("/auth/logout");
      set({ user: null })
      toast.success(response.data.message)
      get().disconnectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    }
  },

  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true })
    try {
      const response = await axiosinctance.put("/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);
      set({ user: response.data });
    } catch (error) {
      console.log("rrororoor", error);
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    } finally {
      set({ isUpdatingProfile: false })
    }
  },


  connectSocket: () => {
    const { user } = get();
    if (!user || get().socket?.connected) return;
    const socket = io(BASE_URL, {
       query : {
        userId : user.user._id
       }
    })
    socket.connect();

    set({ socket: socket })

    socket.on("getOnlineUsers", (users)=>{
      set({ onlineUsers : users})
    })
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
    set({ socket: null })
  },


}));
