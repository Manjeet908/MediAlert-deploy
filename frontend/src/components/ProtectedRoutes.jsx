import { useAuth } from '@clerk/clerk-react';
import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from "../api/axiosInstance.js";
import Loader from './Loader/Loader.jsx'; // Make sure path is correct

const STORAGE_KEY = 'backend-ready';

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();
  
  const [backendWaking, setBackendWaking] = useState(
    sessionStorage.getItem(STORAGE_KEY) !== 'true'
  );

  useEffect(() => {
    if (!backendWaking) return;

    const wake = async () => {
      try {
        const res = await axiosInstance.get('/health');
        if (res.status !== 200) throw new Error('Backend not reachable');
        
        // Mark as ready so we don't check again this session
        sessionStorage.setItem(STORAGE_KEY, 'true');
        setBackendWaking(false);
      } catch (error) {
        console.error('Backend waking...', error);
        // We do nothing here, letting the LoaderUI continue its timer/retry loop
      }
    };

    wake();
  }, [backendWaking]);
  
  // 1. Show Loader if backend is waking
  
  if ((!isLoaded) || (isSignedIn && backendWaking)) {
    return <Loader isVisible={true} />;
  }
  else if (isSignedIn) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;