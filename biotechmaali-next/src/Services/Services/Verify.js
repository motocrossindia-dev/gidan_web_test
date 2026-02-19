'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, removeToken, storeToken } from './LocalStorageServices'; // Import the necessary functions
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Verify = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [verification, setVerification] = useState({});
  const { access_token, refresh_token } = getToken();
  const navigate = useNavigate();

  const createToken = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/token/refresh/`, {
        refresh: refresh_token
      });
      const data = response.data;
      setVerification(data);

      // Save the new tokens to local storage
      storeToken(data);
      window.location.reload();
      // Retry verifying the new access token
      tokenVerify(data.access);
    } catch (error) {
      const data = error.response.data;
      setVerification(data);

      removeToken();
      localStorage.removeItem('user');
      navigate('/'); ;

      enqueueSnackbar('Session expired! Please login again', { variant: 'error' });
    }
  };

  const tokenVerify = async (token) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/token/verify/`, {
        token: token || access_token
      });
      const data = response.data;
      setVerification(data);
    } catch (error) {
      const data = error?.response?.data;
      // console.error('Error verifying token ', error);
      setVerification(data);

      if (data?.code === 'token_not_valid') {
        createToken();
      }
    }
  };

  useEffect(() => {
    tokenVerify();
  }, []); // Dependency array is empty, so this runs only once when the component mounts

  if (verification?.code === 'token_not_valid') {
    // enqueueSnackbar('Token is not valid!', { variant: 'error' });
  }

  return null; // or <></>, or any other JSX you want to render
};

export default Verify;




