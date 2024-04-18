'use client';
import Link from 'next/link';
import React, { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(
        'http://localhost:3001/api/auth/user/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        }
      );
      if (res.ok) {
        const data = await res.json();
        setShowSuccess(true);
      } else {
        // If response is not ok, get error message from response body
        const { error } = await res.json();
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
    <div className="flex flex-col items-center pt-64 ">
      <h1 className="text-2xl font-bold mb-4">Forgot Password?</h1>

      <div className="card w-96 rounded-lg ">
        <div className="card-body p-3 h-32 text-center">
          <p>
            Enter the email associated with your account and we will send
            instructions on resetting your password
          </p>
        </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
      {showSuccess && (
        <p style={{ textAlign: 'center' }}>
          We have sent an email to your email. <br></br>Click the Link to change
          your password.
        </p>
      )}

      {/* Error popup */}
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
