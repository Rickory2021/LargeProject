'use client';
require('dotenv').config();
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CookieComponent from '../dashboard/components/CookieComponent.jsx';

export default function BusinessSignUp() {
  const [businessId, setBusinessId] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleUserIdChange = userId => {
    setUserId(userId);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log(userId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/auth/business/add-connection`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            businessId,
            userId
          })
        }
      );
      if (res.ok) {
        router.push('/dashboard');
      } else if (res.status == 400) {
        // If response is not ok, get error message from response body
        const { error } = await res.json();
        console.log(error);
        setError(error);
      } else {
        const { error } = await res.json();
        console.log(error);
        setError(error);
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  // Function to close the error popup
  const closeErrorPopup = () => {
    setError('');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen pb-16">
      <CookieComponent
        cookieName={'accessToken'}
        onUserIdChange={handleUserIdChange}
      />

      <h1 className="text-4xl font-bold mb-8">Connect to a Business</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="businessId"
          placeholder="Business ID"
          value={businessId}
          onChange={e => setBusinessId(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />

        <CookieComponent
          cookieName={'accessToken'}
          onUserIdChange={handleUserIdChange}
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Connect
        </button>
      </form>
      <Link href="/business-sign-up">
        <button className="mt-4 text-blue-500">
          Don't have an Business to connect to?<br></br> Create one here
        </button>
      </Link>

      {error && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md">
            <p className="text-red-500">{error}</p>
            <button
              onClick={closeErrorPopup}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
