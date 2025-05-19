import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          alert('Your session has expired. Please log in again.');
          setIsValid(false);
          return;
        }

        await axios.get('http://localhost:8000/api/validate-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsValid(true);
      } catch (error) {
        localStorage.removeItem('token');
        alert('Your session is invalid. Please log in again.');
        setIsValid(false);
      }
    };

    validateToken();
  }, [token]);

  if (isValid === null) return null; 
  if (!isValid) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
