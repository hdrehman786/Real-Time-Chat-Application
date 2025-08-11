import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Settings from "./Pages/Settings";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import { useAuth } from "./lib/useAuth";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Navbar from "./component/Navbar";
import { useTheme } from "./lib/useTheme";

const App = () => {
  const { user, checkAuth, isCheckingUser, logout,onlineUsers } = useAuth();

    const { theme } = useTheme();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-14 animate-spin" />
      </div>
    );
  }


  return (
    <div data-theme={theme}>
     
     <Navbar />

      <Routes>
        <Route path="/" element={user?.success ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user?.success ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={user?.success ? <Navigate to="/" /> : <Signup />} />
        <Route path="/settings" element={user?.success ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user?.success ? <Profile /> : <Navigate to="/login" />} />

      </Routes>


      <Toaster />

    </div>
  );
};

export default App;
