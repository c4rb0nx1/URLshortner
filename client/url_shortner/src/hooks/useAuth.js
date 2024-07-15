// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('JWToken='))?.split('=')[1];
      console.log('Token:', token);
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      console.log('IsLoggedIn:', isLoggedIn);

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          console.log("User Id from token:", decodedToken.id);
          console.log("TypeOf :",decodedToken.id)

          setUserId(decodedToken.id)
          const strId = decodedToken.id.toString()
          console.log("Type of strId: ",typeof(strId))
          localStorage.setItem("userID",decodedToken.id); 
        } catch (error) {
          console.error('Invalid token:', error);
          setUserId(null);
        }
      } else if (isLoggedIn) {
        console.log('User logged in but no token found. Might need to refresh.');
        // You might want to implement a token refresh mechanism here
      } else {
        setUserId(null);
      }
      setLoading(false);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000);

    return () => clearInterval(interval);
  }, []);

  return { userId, loading };
};