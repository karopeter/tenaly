"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "@/services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [token, setToken]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    hasSubmitted: false,
    isVerified: false, 
    loading: false 
  });

  const normalizeRole = (role) => {
    if (role === "customer") return "buyer";
    if (role === "seller") return "seller";
    return "buyer";
  }

  useEffect(() => {
    const storedProfile = localStorage.getItem("profile");
    const storedToken   = localStorage.getItem("token");

    if (storedToken && storedProfile) 
      setToken(storedToken);
      const parsedProfile = JSON.parse(storedProfile);

      // Normalize role 
      parsedProfile.role = normalizeRole(parsedProfile.role);
      setProfile(parsedProfile);
      setIsLoggedIn(true);

      // Initialize verification status from stored profile 
      if (parsedProfile.isVerified !== undefined) {
        setVerificationStatus(prev => ({
           ...prev,
          isVerified: parsedProfile.isVerified,
          hasSubmitted: parsedProfile.hasSubmittedVerification || parsedProfile.isVerified
        }));
      }
      refreshProfile(storedProfile);
      checkVerificationStatus(storedToken);
    

    setLoading(false);
  }, []);

  const checkVerificationStatus = async (authToken = token) => {
    if (!authToken) return;

    setVerificationStatus(prev => ({ ...prev, loading: true }));

    try {
      const response = await api.get("/verification/status", {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
      });

      setVerificationStatus({
        hasSubmitted: response.data.hasSubmitted,
        isVerified: response.data.isVerified,
        loading: false
      });


      // If user is now verified, refresh their profile data 
      if (response.data.isVerified && !profile?.isVerified) {
        refreshProfile(authToken);
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      setVerificationStatus({
        hasSubmitted: false, 
        isVerified: false,
        loading: false
      });
    }
  };

  const refreshProfile = async (authToken = token) => {
     if (!authToken) return;

     try {
     const response = await api.get("/profile", {
       headers: {
          Authorization: `Bearer ${authToken}`,
       },
     });

     const updatedProfile = response.data;

     // Normalize role 
     updatedProfile.role = normalizeRole(updatedProfile.role);
     setProfile(updatedProfile);
     localStorage.setItem("profile", JSON.stringify(updatedProfile));

     if (updatedProfile.isVerified !== undefined) {
       setVerificationStatus(prev => ({
        ...prev,
          isVerified: updatedProfile.isVerified,
          hasSubmitted: updatedProfile.hasSubmittedVerification || updatedProfile.isVerified
       }));
     }
     } catch (error) {
       console.error("Error refreshing profile:", error);
     }
  };

  const switchRole = async (newRole) => {
  try {
    const response = await api.patch("/profile/switch-role", { role: newRole }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const updatedProfile = { ...profile, role: newRole };
    setProfile(updatedProfile);
    localStorage.setItem("profile", JSON.stringify(updatedProfile));
    
    toast.success(`Switched to ${newRole} mode`);

    // Force page reload 
    window.location.reload();


    return true;
  } catch (error) {
    console.error("Error switching role:", error);
    toast.error("Failed to switch role");
    return false;
  }
};

  const login = (profileData, authToken) => {
    profileData.role = normalizeRole(profileData.role);


    localStorage.setItem("token", authToken);
    localStorage.setItem("profile", JSON.stringify(profileData));
    setToken(authToken);
    setProfile(profileData);
    setIsLoggedIn(true);

    // Initialize verification status from profile if available 
    if (profileData.isVerified !== undefined) {
      setVerificationStatus(prev => ({
         ...prev,
        isVerified: profileData.isVerified,
        hasSubmitted: profileData.hasSubmittedVerification || profileData.isVerified
      }));
    }

   console.log("Login - User role:", profileData.role, "isVerified:", profileData.isVerified);

    // check verification status after login 
    checkVerificationStatus(authToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    setToken(null);
    setProfile(null);
    setIsLoggedIn(false);
    setVerificationStatus({
       hasSubmitted: false,
      isVerified: false,
      loading: false
    });
    toast.success("You've logged out successfully!");
    router.push("/");
  };

  const updateVerificationStatus = (status) => {
    setVerificationStatus(prev => ({ ...prev, ...status }));
  };


  const role = normalizeRole(profile?.role);

  return (
    <AuthContext.Provider
      value={{ 
        profile, 
        token, 
        isLoggedIn, 
        loading,
        login, 
        logout, 
        role,
        verificationStatus,
        checkVerificationStatus,
        updateVerificationStatus,
        refreshProfile,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
