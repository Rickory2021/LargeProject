'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';
import { RiMailSendFill } from 'react-icons/ri';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const router = useRouter();

  useEffect(() => {
    // Define an async function for fetching data
    async function verifyEmail() {
      try {
        const response = await fetch(
          `https://slicer-backend.vercel.app/api/auth/user/verify-email?token=${token}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }
        );
        const responseData = await response.json();
        console.log(responseData); // Logging response from server
        if (!responseData.error) {
          router.push('/verify-email-complete');
        }
        // Handle response as needed
      } catch (error) {
        console.error('Error:', error);
      }
    }

    // Call the async function
    verifyEmail();
  }, []); // Include `token` in the dependency array for re-runs when `token` changes

  return (
    <div className="min-h-screen bg-wgite-600 flex items-center justify-center">
      <div className="bg-blue p-8 rounded shadow-md max-w-md w-full text-center">
        <RiMailSendFill className="text-6xl text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Email Needs to be Verified!</h2>
        <p className="text-lg text-gray-800 mb-6">
          We have sent an email to your email. Click the Link for your email to
          be verified.
        </p>
      </div>
    </div>
  );
}
