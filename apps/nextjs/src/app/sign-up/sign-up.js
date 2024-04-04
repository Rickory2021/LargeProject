'use client';

import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [businessIdList, setBusinessIdList] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/auth/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          password,
          email,
          businessIdList
        })
      });
      if (res.ok) {
        router.push('/sign-in');
      } else if (res == 400) {
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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="firstName"
          placeholder="FirstName"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="lastName"
          placeholder="LastName"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="username"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
      <Link href="/sign-in">
        <button className="mt-4 text-blue-500">
          Have an account? Login here
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
