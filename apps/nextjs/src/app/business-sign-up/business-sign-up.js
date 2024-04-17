'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CookieComponent from '../dashboard/components/CookieComponent.jsx';
import { createSearchParamsBailoutProxy } from 'next/dist/client/components/searchparams-bailout-proxy.js';

export default function BusinessSignUp() {
  const [businessName, setBusinessName] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Function to handle userId change
  const handleUserIdChange = userId => {
    setUserId(userId);
  };

  const getBusinessId = async () => {
    const response = await fetch(
      'https://slicer-backend.vercel.app/api/auth/user/user-info?id=' + userId,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      const { businessIdList } = responseData;
      return { businessIdList };
    } else {
      console.log('error');
      const errorData = await response.json();
      return null;
    }
  };

  useEffect(() => {
    if (userId !== '') {
      setLoading(false);
      getBusinessId().then(data => {
        console.log('Business: ', data.businessIdList[0]);
        setBusinessId(data.businessIdList[0]);
      });
    }
  }, [userId]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const resBusiness = await fetch(
        'https://slicer-backend.vercel.app/api/auth/business/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName
          })
        }
      );
      if (resBusiness.ok) {
        const data = await resBusiness.json();
        let { businessId } = data;
        const resConnect = await fetch(
          'https://slicer-backend.vercel.app/api/auth/business/add-connection',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              businessId,
              userId
            })
          }
        );
        if (resConnect.ok) {
          router.push('/dashboard');
        } else if (resConnect.status == 400) {
          // If response is not ok, get error message from response body
          const { error } = await resConnect.json();
          console.log(error + '400');
          setError(error);
        } else {
          const { error } = await resConnect.json();
          console.log(error + '4');
          setError(error);
        }
      } else if (resBusiness.status == 400) {
        // If response is not ok, get error message from response body
        const { error } = await resBusiness.json();
        console.log(error + '400');
        setError(error);
      } else {
        const { error } = await resBusiness.json();
        console.log(error + '4');
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
    <div>
      {loading && (
        <CookieComponent
          cookieName={'accessToken'}
          onUserIdChange={handleUserIdChange}
        />
      )}

      <div className="flex flex-col items-center justify-center h-screen pb-16">
        <h1 className="text-4xl font-bold mb-8">Create a Business</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="businessName"
            placeholder="Business Name"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Create
          </button>
        </form>
        <Link href="/business-sign-in">
          <button className="mt-4 text-blue-500">
            Already have a business? <br></br>Connect here
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
    </div>
  );
}
