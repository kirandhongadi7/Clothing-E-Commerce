import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { loginUser,registerUser,fetchUserProfile } from "../api/api";
import { useAlert } from "./AlertContext";

const AuthContext = createContext()

export const AuthProvider =({children}) =>{
 const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);
  const { showAlert } = useAlert();
//Initial load
    useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const res = await fetchUserProfile();
          if (res.success && res.data.user) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn("Session expired or invalid, logging out:", err.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);
// loggin
const login = async (email, password) => {
    try {
      const res = await loginUser(email, password);
      if (res.success && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showAlert(`Welcome back, ${res.data.user.name}!`, "success");
        return { success: true };
      }
    } catch (error) {
      showAlert(error.message || "Failed to log in", "danger");
      return { success: false, message: error.message };
    }
  };
  //Register 

   const register = async (userData) => {
    try {
      const res = await registerUser(userData);
      if (res.success && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showAlert("Registration successful! Welcome to Aura Ethnic.", "success");
        return { success: true };
      }
    } catch (error) {
      showAlert(error.message || "Failed to register", "danger");
      return { success: false, message: error.message };
    }
  };
//logout
   const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    showAlert("Logged out successfully.", "info");
  };

  const refreshUser = async () => {
    try {
      const res = await fetchUserProfile();
      if (res.success && res.data.user) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };
  return (
    <AuthContext.Provider value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
    }}>
       {children}
    </AuthContext.Provider>
  )
}

export const useAuth =() =>{
    const context = useContext(AuthContext)
     if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}