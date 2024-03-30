'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export function jwt() {
  const jwtVerification = () => {
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState('');
    const router = useRouter();

    useEffect(() => {
      const verifyCookie = async () => {
        if (!cookies.token) {
          router.push('/sign-in');
        }
        const { data } = axios.post(
          'http://localhost:3001/api/auth/',
          {},
          { withCredentials: true }
        );
        const { status, user } = data;
        setUsername(user);
        return status
          ? toast(`Hello ${user}`, {
              position: 'top-right'
            })
          : (removeCookie('token'), router.push('/login'));
      };
    });
  };
}
