import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function CookieComponent({ cookieName, onUserIdChange }) {
  const router = useRouter();
  const [cookieValue, setCookieValue] = useState(null);

  useEffect(() => {
    console.log('Here');
    const cookie = document.cookie
      .split(';')
      .find(c => c.trim().startsWith(`${cookieName}=`));
    if (cookie) {
      const value = cookie.split('=')[1];
      setCookieValue(value);
      console.log('cookie: ' + value);
    } else {
      //No cookie of accessToken name
      router.push('/sign-in');
    }
  }, []);

  const verifyAccessToken = async accessToken => {
    console.log(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/auth/${accessToken}`
    );
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/auth/${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      const { status, userId } = responseData;
      return { status, userId };
    } else {
      //nothing returned (wont happen with how api is setup but just in case)
      const errorData = await response.json();
      return null;
    }
  };

  useEffect(() => {
    if (cookieValue) {
      verifyAccessToken(cookieValue).then(data => {
        console.log('Status:', data.status);
        console.log('User ID: ', data.userId);
        if (data.status == false) {
          //verification failed
          router.push('/sign-in');
        } else {
          //verification successful
          onUserIdChange(data.userId);
        }
      });
    }
  }, [cookieValue, onUserIdChange]); // Trigger verification when cookieValue changes

  return null;
}

export default CookieComponent;
