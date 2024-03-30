'use client';
import { SideNav } from '@repo/ui/side-nav';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export function Dashboard() {
  const router = useRouter();
  const [cookies, removeCookie] = useCookies([]);
  console.log(cookies);
  const [username, setUsername] = useState('');
  useEffect(() => {
    const verifyCookie = async () => {
      //   if (!cookies.token) {
      // console.log(cookies);
      // router.push('/sign-in');
      // }
      const { data } = await axios.post(
        'http://localhost:3001/api/auth',
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
    verifyCookie();
  }, [cookies, router, removeCookie]);
  const Logout = () => {
    removeCookie('token');
    router.push('/signup');
  };

  return (
    <div className="flex flex-col">
      <SideNav />
    </div>
  );
}
