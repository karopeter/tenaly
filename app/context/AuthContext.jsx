"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [token, setToken]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedProfile = localStorage.getItem("profile");
    const storedToken   = localStorage.getItem("token");

    if (storedToken && storedProfile) {
      setToken(storedToken);
      setProfile(JSON.parse(storedProfile));
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  const login = (profileData, authToken) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("profile", JSON.stringify(profileData));
    setToken(authToken);
    setProfile(profileData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    setToken(null);
    setProfile(null);
    setIsLoggedIn(false);
    toast.success("You've logged out successfully!");
    router.push("/");
  };

  const role = profile?.role || null;

  return (
    <AuthContext.Provider
      value={{ profile, token, isLoggedIn, loading, login, logout, role  }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
