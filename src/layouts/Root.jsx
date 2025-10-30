import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getApperClient } from "@/services/apperClient";
import Error from "@/components/ui/Error";
import { clearUser, setInitialized, setUser } from "@/store/userSlice";
import { getRouteConfig, verifyRouteAccess } from "@/router/route.utils";

// Auth context for logout functionality
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within Root component");
  }
  return context;
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

export default function Root() {
  const { isInitialized, user } = useSelector(state => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    // Guard: exit early if not initialized
    if (!isInitialized) return;

    const config = getRouteConfig(location.pathname);

    const { allowed, redirectTo, excludeRedirectQuery } = verifyRouteAccess(config, user);

    // Guard: exit early if access is allowed or no redirect
    if (allowed || !redirectTo) return;

    // Build redirect URL - add redirect query param unless excluded
    let redirectUrl = redirectTo;
    if (!excludeRedirectQuery) {
      const redirectPath = location.pathname + location.search;
      const separator = redirectTo.includes('?') ? '&' : '?';
      redirectUrl = `${redirectTo}${separator}redirect=${encodeURIComponent(redirectPath)}`;
    }

    navigate(redirectUrl, { replace: true });
  }, [isInitialized, user, location.pathname, location.search, navigate]);

const waitForSDK = async () => {
    const maxAttempts = 50; // Try for ~5 seconds total
    const baseDelay = 100;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (window.ApperSDK) {
        console.log('ApperSDK loaded successfully');
        return true;
      }
      
      // Progressive backoff: 100ms, then increasing by 50ms each attempt
      const delay = baseDelay + (Math.floor(attempt / 5) * 50);
      
      if (attempt % 10 === 0) {
        console.warn(`Still waiting for ApperSDK... (attempt ${attempt}/${maxAttempts})`);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    console.error(
      'ApperSDK failed to load. Please ensure the SDK script tag is present in index.html: ' +
      '<script src="%VITE_APPER_SDK_CDN_URL%"></script>'
    );
    return false;
  };

  const handleAuthSuccess = (userData) => {
    if (userData) {
      dispatch(setUser(userData));
    }
    dispatch(setInitialized(true));
    setAuthInitialized(true);
  };

  const handleAuthError = (error) => {
    console.error('Authentication error:', error);
    dispatch(clearUser());
    dispatch(setInitialized(true));
    setAuthInitialized(true);
  };

  const handleAuthComplete = () => {
    dispatch(setInitialized(true));
    setAuthInitialized(true);
  };

  const initializeAuth = async () => {
    try {
      const sdkAvailable = await waitForSDK();
      
      if (!sdkAvailable) {
        console.error('ApperSDK failed to load within timeout period');
        dispatch(clearUser());
        handleAuthComplete();
        return;
      }

      const apperClient = getApperClient();

      if (!apperClient || !window.ApperSDK) {
        console.error('Failed to initialize ApperSDK or ApperClient');
        dispatch(clearUser());
        handleAuthComplete();
        return;
      }

      const { ApperUI } = window.ApperSDK;

      ApperUI.setup(apperClient, {
        target: "#authentication",
        clientId: import.meta.env.VITE_APPER_PROJECT_ID,
        view: "both",
        onSuccess: handleAuthSuccess,
        onError: handleAuthError,
      });

    } catch (error) {
      console.error('Failed to initialize authentication:', error);
      dispatch(clearUser());
      const authPages = ["/login", "/signup", "/callback"];
      const isOnAuthPage = authPages.some(page =>
        window.location.pathname.includes(page)
      );
      if (isOnAuthPage) {
        navigate("/");
      }
      handleAuthComplete();
    }
  };

  const logout = async () => {
    try {
      dispatch(clearUser());
      navigate("/login");
      await window.ApperSDK?.ApperUI?.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Show loading spinner until auth is initialized
  if (!authInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ logout, isInitialized: authInitialized }}>
      <Outlet />
    </AuthContext.Provider>
  );
}