'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, removeToken, storeToken } from './LocalStorageServices'; // Import the necessary functions
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';

const Verify = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [verification, setVerification] = useState({});
  const router = useRouter();

  const createToken = async (refresh_token) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`, {
        refresh: refresh_token
      });
      const data = response.data;
      setVerification(data);
      // Save the new tokens to local storage and reload to pick them up
      storeToken(data);
      window.location.reload();
    } catch (error) {
      const data = error?.response?.data;
      setVerification(data || {});

      removeToken();
      localStorage.removeItem('user');
      router.push('/');

      enqueueSnackbar('Session expired! Please login again', { variant: 'error' });
    }
  };

  const tokenVerify = async () => {
    // Read tokens inside the effect so localStorage is always available (client-only)
    const { access_token, refresh_token } = getToken();

    // No token at all — guest user, nothing to verify
    if (!access_token) return;

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/token/verify/`, {
        token: access_token
      });
      setVerification(response.data);
    } catch (error) {
      const data = error?.response?.data;
      setVerification(data || {});

      if (data?.code === 'token_not_valid') {
        createToken(refresh_token);
      }
    }
  };

  useEffect(() => {
    tokenVerify();
  }, []); // Runs only once on mount (client-side)

  return null;
};

export default Verify;




