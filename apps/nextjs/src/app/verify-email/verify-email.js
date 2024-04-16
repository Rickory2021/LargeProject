'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/auth/user/verify-email?token=${token}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify() // Replace with your payload
          }
        );
        const responseData = await response.json();
        console.log(responseData); // Logging response from server
        // Handle response as needed
      } catch (error) {
        console.error('Error:', error);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <FaCheckCircle className="text-6xl text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
        <p className="text-lg text-gray-800 mb-6">
          Your email has been successfully verified.<br></br>You can now close
          this tab.
        </p>
      </div>
    </div>
  );
}
